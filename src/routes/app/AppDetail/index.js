import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import { Tabs, Spin, Button, Modal, Table, Divider, 
  Icon, InputNumber, Slider, message, Input } from 'antd';
// import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import {actionCreators} from '../store'
import './style.css'
import { SERVER } from '../../../utils/constants'

const TabPane = Tabs.TabPane;

class AppDetail extends PureComponent {

  componentDidMount() {
    const params = this.props.match.params;
    // console.log('AppDetail', params)
    if (!params || params.id <= 0) {
      this.props.history.goBack()
      return
    }

    this.props.getAppDetail(params.id, () => {})
    this.props.getAppHistory(params.id, (ret, size) => {
      this.props.setLoading(false)
      if (size === 0) {
        this.props.history.goBack()
      }
    })
  }

  componentWillUnmount() {
    this.props.setLoading(false)
  }

  render() {
    const {appInfo, historyList, changeAppInfo, deleteAppVersion, getAppHistory, getAppDetail, setLoading, history, deleteApp} = this.props
    if (!appInfo) {
      return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            margin: '-80px 0 0 80px',
          }}>
          <Spin size="large"/>
        </div>
      )
    }

    return (
      <div>
        <div style={{
            width: '100%',
            marginBottom: '10px',
          }}>
          <Link to={SERVER+'/apppublish'}>
            <Button type='primary' size='large'>
              上传新版本</Button>
          </Link>
        </div>        
        <Tabs defaultActiveKey="1">
          <TabPane tab="应用概述" key="1">
            <AppSummary appInfo={appInfo}/>
            <AppHistory
              appId={appInfo.get('appId')}
              list={historyList}
              changeAppInfo={changeAppInfo}
              getAppHistory={getAppHistory}
              getAppDetail={getAppDetail}
              deleteAppVersion={deleteAppVersion}
              setLoading={setLoading}
              history={history}/>
          </TabPane>
          <TabPane tab="设置" key="2">
            <Setting appInfo={appInfo} deleteApp={deleteApp} history={history}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


class AppSummary extends PureComponent {
  render() {
    const {appInfo} = this.props
    return (
      <section style={{
        backgroundColor: '#5a5959',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(33,33,33,.2)',
        display: 'block',
        boxSizing: 'border-box',
        borderRadius: '2px',
      }}>
        <div style={{padding: '20px 15px', backgroundColor: '#f5f6f8'}}>
          <img src={appInfo.get('appIcon')} 
            alt='icon'
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              border: '1px solid #ddd',
              verticalAlign: 'middle', }}/>
          <div style={{
            display: 'inline-block',
            marginLeft: '20px',
            height: '60px',
            verticalAlign: 'middle', }}>
            <div style={{
              fontSize: '25px',
              color: '#505458',
            }}>{appInfo.get('appName')}</div>
            <div>
              <img src={require('../../../statics/ic-android.png')}
                alt='android'
                style={{
                  width: '20px',
                  height: '20px',
                }}/>
              {appInfo.get('system') === 'android' 
                ? ' 适用于 Android 设备' : ' 适用于 Android 设备'}
            </div>
          </div>
          <div style={{                  
              marginLeft: '20px',
              display: 'inline-block',
            }}
            >
            <img alt='qrcode' src={appInfo.get('downloadQR')} style={{
                width: '50px',
                height: '50px',
                transform: 'scale(1)',
                transition: 'all .25s ease-in-out',
                transformOrigin: '0% 50%',
              }}
            onMouseEnter={() => this.mounseEnterQrcode(this.qrcode)}
            onMouseLeave={() => this.mounseLeaveQrcode(this.qrcode)}
            ref={(view) => this.qrcode = view}/>
          </div>
        </div>
        <div style={{overflow: 'hidden', minWidth: '720px', background: '#fafafa'}}>
          <div style={{width: '33.3%', float: 'left', borderRight: '1px solid #eff2f4', padding: '15px'}}>
            <div style={{fontWeight: '500'}}>Bundle ID</div>
            <div>{appInfo.get('bundleId')}</div>
          </div>
          <div style={{width: '33.3%', float: 'left', borderRight: '1px solid #eff2f4', padding: '15px'}}>
            <div style={{fontWeight: '500'}}>App Key</div>
            <div>{appInfo.get('appKey')}</div>
          </div>
          <div style={{width: '33.3%', float: 'left', padding: '15px'}}>
            <div>下载地址</div>
            <a href={appInfo.get('downloadUrl')} target='_blank' rel="noopener noreferrer"
              style={{display: 'block', width: '100%', overflow: 'auto', paddingBottom: '5px'}}>
              {appInfo.get('downloadUrl')}
            </a>
          </div>
        </div>
      </section>
    )    
  }

  mounseEnterQrcode(qrcode) {
    // console.log('mounseEnterQrcode', qrcode.style)
    qrcode.style.transform = 'scale(3.5)'
  }

  mounseLeaveQrcode(qrcode) {
    // console.log('mounseLeaveQrcode', qrcode.style)
    qrcode.style.transform = 'scale(1)'
  }
}

class AppHistory extends PureComponent {
  constructor(props) {
    super(props)
    this.showConfirm = this.showConfirm.bind(this)
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this)
    this.showModal = this.showModal.bind(this)
    this.onGrayScaleChange = this.onGrayScaleChange.bind(this)
    this.onUpgradeDescChange = this.onUpgradeDescChange.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.changeForceUpdate = this.changeForceUpdate.bind(this)
    this.changePublishStatus = this.changePublishStatus.bind(this)

    this.state = { 
      visible: false,
      desc: "",
      versionId: 0,
      grayscale: 0,
      upgradeDesc: '',
      flag: 0,
      data: null,
    }
    // console.log('AppHistory appId', this.props.appId)
  }

  render() {
    let {list} = this.props
    if (list) {
      list = list.toJS()
      for (let i = 0; i < list.length; i++) {
        list[i].key = i
      }
    }
    // console.log('AppHistory list', list)

    const columns = [{
      title: '版本',
      dataIndex: 'versionName',
      width: 100,
      align:'center',
    }, 
    {
      title: '版本号',
      dataIndex: 'versionCode',
      width: 100,
      align:'center',
    },
    {
      title: '灰度比例',
      dataIndex: 'grayscale',
      width: 100,
      align:'center',
      render: (text, record) => (
        <div style={{display:'inline-block'}}>
          <div style={{ display: 'inline-block',marginRight:"8px"}} >{text}%</div>
          <Icon type="edit" theme="twoTone" onClick={() => this.showModal({...record}, 0)} style={{cursor: 'pointer'}}/>
        </div>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      width: 100,
      align:'center',
    }, 
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      width: 100,
      align:'center',
    }, 
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 150,
      align:'center',
    }, 
    {
      title: '版本说明',
      dataIndex: 'upgradeDesc',
      width: 100,
      render: (text, record) => (
        <div style={{paddingRight:'10px'}}>
          <span style={{display: 'inline-block', marginRight:"8px", maxWidth: '150px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap', float: 'left',}}
            title={text}>{text}</span>
          <Icon type="edit" theme="twoTone" style={{display: 'inline', cursor: 'pointer'}} onClick={() =>this.showModal({...record}, 1)}/>
        </div>
      ),
    }, 
    {
      title: '操作',
      dataIndex: 'appOpr',
      width: 390,
      // fixed: 'right',
      render: (text, record) => {
        const minWidth = '80px'
        return ( 
        <span>
          <Link 
          target='_blank'
          to={SERVER+'/appDownload/'+record.appId+'/'+record.versionId}
          >
          <Button  type="primary" icon="download" style={{minWidth: minWidth}}>下载</Button>
          </Link>
          <Divider type="vertical" />
           {
             record.isForce === 0 ?  
             <Button  style={{minWidth: minWidth, backgroundColor: '#F9B62C', color: '#FFFFFF'}} 
                onClick={ () => this.showConfirm('是否强制更新',record.versionId, 1,this.changeForceUpdate)}>非强制</Button> :  
             <Button  style={{minWidth: minWidth, backgroundColor: '#FF4D4F', color: '#FFFFFF'}} 
                onClick={ () => this.showConfirm('是否非强制更新',record.versionId, 0,this.changeForceUpdate)}>强制</Button>           
           }
          <Divider type="vertical" />
           {
             record.isPublish === 0 ?  
             <Button  style={{minWidth: minWidth, backgroundColor: '#575757',color:'#FFFFFF'}} 
                onClick={ () => this.showConfirm('是否发布',record.versionId, 1,this.changePublishStatus)}>未发布</Button> :  
             <Button  style={{minWidth: minWidth, backgroundColor: '#07DA00',color:'#FFFFFF'}} 
                onClick={ () => this.showConfirm('是否取消发布',record.versionId, 0,this.changePublishStatus)}>已发布</Button>
           }          
          <Divider type="vertical" />
          <Button type="danger" style={{minWidth: minWidth}} onClick={ () => this.showDeleteConfirm(
            record, this.props.getAppHistory, this.props.deleteAppVersion, this.props.setLoading,
            this.props.history)}>删除</Button>
        </span>
      )},
    }
  ]
    return (
      <div style={{backgroundColor: '#fff'}}>
        <Table columns={columns}
          dataSource={list}
          scroll={{ x: 1330}}
          locale={{emptyText: '暂无数据'}}
          pagination={false}/>
        {(list === null || list.size === 0) ? null :
          <Modal title={this.state.type === 0 ? "灰度比例":"版本说明"}
            maskClosable={false}
            visible={this.state.visible}
            onOk={() =>this.handleOk(this.state.data, this.state.type)}
            onCancel={this.handleCancel}
            cancelText='取消'
            okText='确认'
            destroyOnClose={true}>
            {
              this.state.type === 0 ?
              <div style={{textAlign: 'center'}}>
                <InputNumber min={1} max={100} size="large"
                  value={this.state.grayscale}
                  style={{width: '55px'}}
                  disabled/>
                <span style={{ fontSize:'20px'}}> %</span>
                <Slider
                  min={1}
                  max={100}
                  onChange={this.onGrayScaleChange}
                  value={this.state.grayscale}/>
              </div> 
              : <Input.TextArea rows={4} ref={(view) => {this.descText = view}}
                  value={this.state.upgradeDesc}
                  onChange={this.onUpgradeDescChange}/>
            }
          </Modal>
        }
      </div>
    )
  }

  onGrayScaleChange(value) {    
    this.setState({
      grayscale: value
    })
  }

  onUpgradeDescChange(e) {
    this.setState({
      upgradeDesc: e.target.value
    })
  }

  showModal = (data, type) => {
    // console.log('showModal', type, data)
    this.setState({
      visible: true,
      type,
      data,
      grayscale: data.grayscale,
      upgradeDesc: data.upgradeDesc,
    })
  }

  handleOk = (data, type) => {
    // console.log('handleOk', type, data)
    if (type === 0){
      const num = this.state.grayscale
      if (num === data.grayscale) {
        this.setState({visible: false})
      } else {
        this.props.changeAppInfo(this.props.appId, {
          versionId: data.versionId,
          grayscale: num,
        }, (ret) => {
          if (ret) {
            this.props.getAppHistory(this.props.appId, () => {this.props.setLoading(false)})
          } else {
            this.props.setLoading(false)
          }
        })
        this.setState({visible: false})
      }
    } else {
      const value = this.descText.textAreaRef.value.trim()
      if (!value) {
        message.info('请输入版本描述')
        this.descText.focus()
      } else if (value === data.upgradeDesc) {
        this.setState({visible: false})
      } else {
        this.props.changeAppInfo(this.props.appId, {
          versionId: data.versionId,
          upgradeDesc: value,
        }, (ret) => {
          if (ret) {
            this.props.getAppHistory(this.props.appId, () => {this.props.setLoading(false)})
          } else {
            this.props.setLoading(false)
          }
        })
        this.setState({visible: false})
      }
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,      
    });
  }

  showConfirm(message, versionId, flag, callback) {
    // console.log('showConfirm flag', flag)
    Modal.confirm({
      title: '应用列表',
      content: message,
      okText: '确认',
      cancelText: '取消',
      onOk() {       
        callback(versionId, flag);    
      },
      onCancel() {
      },
    });
  }
  
  showDeleteConfirm(data, getAppHistory, deleteVersion, setLoading, history) {
    const {appId} = this.props
    Modal.confirm({
      title: '应用列表',
      content: '是否删除当前应用',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteVersion(appId, data.versionId, 
          (ret) => {
            if (ret) {
              getAppHistory(appId, (ret, size) => {
                setLoading(false)
                if (size === 0) {
                  history.goBack()
                }
              })
            } else {
              setLoading(false)
            }
          });
      },
      onCancel() {
      },
    });
  }

  changeForceUpdate(versionId, value) {
    this.props.changeAppInfo(this.props.appId, {
      versionId,
      isForce: value,
    }, (ret) => {
      if (ret) {
        this.props.getAppHistory(this.props.appId, () => {this.props.setLoading(false)})
      } else {
        this.props.setLoading(false)
      }
    })
  }

  changePublishStatus(versionId, value) {
    this.props.changeAppInfo(this.props.appId, {
      versionId,
      isPublish: value,
    }, (ret) => {
      if (ret) {
        this.props.getAppHistory(this.props.appId, () => {this.props.setLoading(false)})
      } else {
        this.props.setLoading(false)
      }
    })
  }
}

class Setting extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }

  render() {
    return (
      <div>
        <section style={{
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(33,33,33,.2)',
          display: 'block',
          boxSizing: 'border-box',
          width: '350px',
          textAlign: 'center',
          padding: '20px 0',
          marginTop: '10px',
          borderRadius: '3px',
        }}>
          <div>
            <img src={require('../../../statics/delete.png')}
              alt='android'
              style={{
                width: '40px',
                height: '40px',
              }}/>
            <div style={{
                fontSize: '16px',
                marginTop: '20px',
                color: '#5a5959',
              }}>删除应用</div>
            <div style={{
                fontSize: '13px',
                marginTop: '15px',
                color: '#9e9e9e',
              }}>删除当前应用及其所有的相关数据</div>
            <Button type="danger" style={{marginTop: '15px'}} onClick={() => {this.setState({showModal: true})}}>删除</Button>
          </div>
        </section>
        <Modal title='删除应用'
          visible={this.state.showModal}
          onOk={() => {
            this.props.deleteApp(this.nameInput, this.props.appInfo, 
              (ret) => {
                if (ret) {
                  // this.setState({showModal: false})
                  this.props.history.goBack()
                }
              })
          }}
          onCancel={() => {this.setState({showModal: false})}}
          okText= {'确认'}
          cancelText={'取消'}
          destroyOnClose={true}>
          <div>
            <h4 style={{color: '#f44336'}}>              
              删除该应用后所有相关的数据（包括所有版本、下载次数等数据）都将被删除，删除后不可恢复，请谨慎操作！<br/><br/>
            </h4>
            <Input.TextArea rows={2} ref={(view) => {this.nameInput = view}} placeholder={'请输入应用名称'}
              className='version-desc-input'/>
          </div>
        </Modal>
      </div>      
    )    
  }
}

const mapState = (state) => ({
  appInfo: state.getIn(['app', 'appInfo']), 
  historyList: state.getIn(['app', 'appHistory']),
  loading: state.getIn(['app', 'appDetailPageLoading']),
})

const mapDispatch = (dispatch) => ({
  getAppDetail(id, callback) {
    dispatch(actionCreators.setAppDetailPageLoading(true))
    dispatch(actionCreators.getAppDetail(id, callback))
  },
  getAppHistory(id, callback) {
    dispatch(actionCreators.setAppDetailPageLoading(true))
    dispatch(actionCreators.getAppHistory(id, callback))
  },
  changeAppInfo(id, data, callback) {
    dispatch(actionCreators.setAppDetailPageLoading(true))
    dispatch(actionCreators.changeAppInfo(id, data, callback))
  },
  deleteAppVersion(id, versionId, callback) {
    dispatch(actionCreators.setAppDetailPageLoading(true))
    dispatch(actionCreators.deleteAppVersion(id, versionId, callback))
  },
  setLoading(value) {
    dispatch(actionCreators.setAppDetailPageLoading(value))
  },
  deleteApp(input, appInfo, callback) {
    const value = input.textAreaRef.value.trim()
    if (!value) {
      input.focus()
      return
    }
    if (value !== appInfo.get('appName')) {
      message.error('应用名称填写不正确')
      input.focus()
      return
    }
    dispatch(actionCreators.deleteApp(appInfo, callback))
  }
})

export default connect(mapState, mapDispatch)(AppDetail)