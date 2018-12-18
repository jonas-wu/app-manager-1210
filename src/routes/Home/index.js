import React from 'react'
import {Modal,Table,Divider,Button,Icon,Input,InputNumber, Slider,message,Spin } from 'antd'
import { connect } from 'react-redux'
import './style.css'
import { Link } from 'react-router-dom'
import {actionCreators} from './store'
import { SERVER } from '../../utils/constants'
const confirm = Modal.confirm;
class Home extends React.Component {


  constructor(props) {
    super(props)
    this.onPublishRatioChange = this.onPublishRatioChange.bind(this)
    this.showModal = this.showModal.bind(this)
    this.onGrayScaleChange = this.onGrayScaleChange.bind(this)
    this.onUpgradeDescChange = this.onUpgradeDescChange.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
    componentDidMount() {
    this.props.getAppListList()
    }

    componentWillUnmount() {
    
    }


    onPublishRatioChange(value) {
      this.setState({publishRatio: value})
    }
  
    state = { 
         visible: false,
         desc :"",
         versionId:0,
         grayscale: 0,
         upgradeDesc: '',
         publishRatio: 100,
         flag:0,
         title:""

       }

       showModal = (data, type,title) => {
      
        this.setState({
          visible: true,
          type,
          data,
          title:title,
          grayscale: data.grayscale,
          upgradeDesc: data.upgradeDesc,
        })
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


  

    handleOk = (data, type) => {
    //  console.log('handleOk', type, data)
      if (type === 0){
        const value = this.publishRatioInput.inputNumberRef.input.value.trim()
        console.log('handleOk', value)
      
       if (value && parseInt(value) === data.grayscale) {
          this.setState({visible: false})
          console.log('handleOk3', value)
        } else {
          console.log('handleOk4', value)
          this.props.appGaryUpdate(
             data.versionId,
             value,
          )
          this.setState({visible: false})
        }
      } else if(type === 1){
        const value = this.descText.textAreaRef.value.trim()
        if (!value) {
          message.info('请输入版本描述')
          this.descText.focus()
        } else if (value === data.upgradeDesc) {
          this.setState({visible: false})
        } else {
          this.props.appDescUpdate(
            data.versionId,
            value,
          )
          this.setState({visible: false})
        }
      }else{

        const value = this.descText.textAreaRef.value.trim()
        if (!value) {
          message.info('请输入应用名称')
          this.descText.focus()
        }  else {
          this.props.appDelete(
            data.appId,
            value,
          )
          this.setState({visible: false})
        }
      }


    }
  

    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
        
      });
    }



  

  render() {
  
    const {appList} = this.props;
   // console.log("----->count"+appList)

    if (!appList) {
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
      
      <div style={{background: '#ffffff'}}>

       <div style={{
            width: '100%',
            paddingBottom: '15px',
            background: '#F0F2F5',
          }}>
          <Link to={SERVER+'/apppublish'}>
            <Button type='primary' size='large'>
              上传新应用</Button>
          </Link>
        </div>     

          <Table size='middle' 
                 rowKey="appId" 
                 columns={[{
                 key: 'appName',
                 title: '应用名称',
                 dataIndex: 'appName',
                 width: 160,
    
                render: (text, record) => (
                  <div style={{
                    display:'inline-block'
                  }}>

                  <img src={record.appIcon} 
                       style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '3px',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                      }}
                     alt="logo"/>
                  <div
                    style={{
                      display: 'inline-block',marginLeft:"8px"}}
                  >{text}
                  </div>

                  </div>
                ),
              }, {
                title: '版本',
                dataIndex: 'versionName',
                width: 100,
                key: 'versionName',
                align:'center'
              }, {
                title: '版本号',
                width: 100,
                dataIndex: 'versionCode',
                key: 'versionCode',
                align:'center'
              }, {
                title: '灰度比例',
                dataIndex: 'grayscale',
                key: 'grayscale',
                align:'center',
                width: 100,
                render: (text, record) => (
                  <div style={{
                    display:'inline-block',
                  }}>

                  
                  <div
                    style={{
                      display: 'inline-block',marginRight:"8px"}}
                  >{text}%
                  </div>

                  <Icon  style={{ cursor:'pointer'}} type="edit" theme="twoTone" onClick={() =>this.showModal({...record},0,'灰度比例')}  />


                  </div>
                ),
              },{
                title: '大小',
                dataIndex: 'size',
                width: 100,
                key: 'size',
                align:'center'
              },{
                title: '下载次数',
                width: 100,
                dataIndex: 'downloadCount',
                key: 'downloadCount',
                align:'center'
              },{
                title: '上传时间',
                dataIndex: 'uploadTime',
                width: 150,
                key: 'uploadTime',
                align:'center'
              },{
                title: '创建人',
                dataIndex: 'userName',
                width: 100,
                key: 'userName',
                align:'center'
              }, {
                title: '版本说明',
                dataIndex: 'upgradeDesc',
                width: 200,
                key: 'upgradeDesc',
              
                render: (text, record) => (
                  <div style={{
                    paddingRight:'10px'
                  }}>

                      <div
                        className='colClass'
                        style={{ display: 'inline-block',marginRight:"8px",maxWidth:'150px',float:'left'}}
                      > <span  title={text}>{text}</span>
                      </div>
                      <div   style={{display: 'inline-block', cursor:'pointer'}}>
                      <Icon  type="edit" theme="twoTone" onClick={() =>this.showModal({...record},1,'版本说明')}  /> 
                      </div>
                  </div>
                ),
              }, {
                title: '操作',
                dataIndex: 'appOpr',
                key: 'appOpr',
                width: 400,
                render: (text, record) => {

                  const minWidth = '80px'
                  return ( 
                  <span>
                    
                    <Link  to={SERVER+'/appdetail/'+record.appId}>
                    <Button style={{ minWidth:minWidth}} >应用详情</Button>
                    </Link>
                    <Divider type="vertical" />
                   
                    <Link  target='_blank' to={SERVER+'/appDownload/'+record.appId+'/'+record.versionId}> 
                    
                    <Button style={{ minWidth:minWidth}} type="primary" icon="download">下载</Button>
                   </Link>
                   
                   
                 
                    <Divider type="vertical" />

                     {

                       record.isForce === 0 ?  
                       <Button  style={{ backgroundColor: '#F9B62C',color:'#FFFFFF',minWidth:minWidth}}  onClick={ () => showConfirm('是否强制更新',record.versionId, 1,this.props.appUpdateStatus)}>非强制</Button> :  
                       <Button style={{ backgroundColor: '#FF4D4F',color:'#FFFFFF',minWidth:minWidth}} onClick={ () => showConfirm('是否非强制更新',record.versionId, 0,this.props.appUpdateStatus)}>强制</Button>
                     
                     }

                    <Divider type="vertical" />

                     {

                       record.isPublish === 0 ?  
                       <Button  style={{ backgroundColor: '#575757',color:'#FFFFFF',minWidth:minWidth}} onClick={ () => showConfirm('是否发布',record.versionId, 1,this.props.appPublishStatus)}>未发布</Button> :  
                       <Button  style={{ backgroundColor: '#07DA00',color:'#FFFFFF',minWidth:minWidth}} type="primary" onClick={ () => showConfirm('是否取消发布',record.versionId, 0,this.props.appPublishStatus)}>已发布</Button>

                     }
                    
                   {/*  <Divider type="vertical" />
                    <Button type="danger" onClick={ () =>this.showModal({...record},2,'删除应用')}>删除</Button> */}
                  </span>
                )},

              }]}
             dataSource={appList}
             scroll={{x: 1600}}
             locale={{emptyText: '暂无数据'}}
             pagination={false}
             
           
              />

              <Modal title={this.state.title}
                      visible={this.state.visible}
                      maskClosable={false}
                      onOk={() =>this.handleOk(this.state.data, this.state.type)}
                      onCancel={this.handleCancel}
                      okText= {'确认'}
                      cancelText={'取消'}
                      destroyOnClose={true}>
                     {this.common()}
              </Modal>


      </div>
    )
  }


 common(){
  
  const value = this.state.type
   switch(value){

     case 0:
       return(

        <div style={{ textAlign:'center'}}>
            <InputNumber min={1} max={100} size="large"
              ref={(view) => {this.publishRatioInput = view}}
              value={this.state.grayscale}
              disabled
              style={{ width:'55px'}}
              onChange={this.onGrayScaleChange}/> <span style={{ fontSize:'20px'}}>%</span>
            <Slider
                min={1}
                max={100}
                onChange={this.onGrayScaleChange}
                value={this.state.grayscale}/>
        </div> 
       );
       

       case 1:
       return(

        <Input.TextArea rows={4} ref={(view) => {this.descText = view}}
                            value={this.state.upgradeDesc}
                            onChange={this.onUpgradeDescChange}/>
       );
        
        case 2:
        return(
          <div>
          <h4 style={{
              color: '#f44336'}}>
              
               删除该应用后所有相关的数据（包括所有版本、Crash、反馈等数据）都将被删除，
               删除后不可恢复，请谨慎操作！<br/><br/></h4>
          <Input.TextArea rows={2} ref={(view) => {this.descText = view}}  placeholder={'请输入应用名称'}/>
          </div>
         );
       
        default:
        break;
   }

 }

}



/**
 *   message  表示提示内容
 *   versionId 版本id
 *   flag 对应的强制，非强制，已发布，未发布的标识
 */
function showConfirm(message,versionId,flag,method) {
  confirm({
    title: '应用列表',
    content: message,
    okText: '确认',
    cancelText: '取消',
    onOk() {
     
      method(versionId,flag);
  
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const mapState = (state) => ({
  appList: state.getIn(['home', 'appListInfo']), 
})

const mapDispatch = (dispatch) => ({

  getAppListList() {
    dispatch(actionCreators.getAppList())
  },

  appUpdateStatus(versionId,isForce){

    dispatch(actionCreators.appUpdateStatus(versionId,isForce))
  },


  appPublishStatus(versionId,isPublish){

    dispatch(actionCreators.appPublishStatus(versionId,isPublish))
  },

  appDelete(appId,appName){

    dispatch(actionCreators.appDelete(appId,appName))
  },

  appDescUpdate(versionId,upgradeDesc){

    dispatch(actionCreators.appDescUpdate(versionId,upgradeDesc))
  },

  appGaryUpdate(versionId,grayscale){

    dispatch(actionCreators.appGaryUpdate(versionId,grayscale))
  }
  
 

})
export default connect(mapState, mapDispatch)(Home)