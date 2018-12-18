import React, {PureComponent, Fragment} from 'react'
import {Form, Input, Radio, Button, InputNumber, Slider, message} from 'antd';
import { connect } from 'react-redux'
import {actionCreators as homeCreators} from '../../Home/store'
import {actionCreators as appCreators} from '../../app/store'

const FormItem = Form.Item;
const {TextArea} = Input;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 5},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 19},
  },
};

class Publish extends PureComponent {
  constructor(props) {
    super(props)
    // console.log('Publish props', props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onPublishRatioChange = this.onPublishRatioChange.bind(this)
    this.state = {
      publishRatio: 100
    }
  }

  onPublishRatioChange(value) {
    this.setState({publishRatio: value})
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.descText.textAreaRef.value.trim()) {
      message.error('请输入版本说明')
      this.descText.focus()
      return
    }

    const {appInfo, publishApp, setPublishInfo, history} = this.props;
    const info = {}
    info.appKey = appInfo.get('appKey')
    info.versionKey = appInfo.get('versionKey')
    info.appIcon = appInfo.get('appIcon')
    info.appName = appInfo.get('appName')
    info.versionName = appInfo.get('versionName')
    info.versionCode = appInfo.get('versionCode')
    info.bundleId = appInfo.get('bundleId')
    info.downloadUrl = appInfo.get('downloadUrl')
    info.downloadPage = appInfo.get('downloadPage')
    info.fileMd5 = appInfo.get('fileMd5')
    info.certSHA1 = appInfo.get('certSHA1')
    info.fileSize = appInfo.get('fileSize')
    info.downloadQR = appInfo.get('downloadQR')
    info.publishStatus = this.publishTimeRadio.state.value
    info.isIncremental = this.patchRadio.state.value
    info.grayscale = this.state.publishRatio
    info.upgradeDesc = this.descText.textAreaRef.value.trim()

    publishApp(info, (ret) => {
      if (ret) {
        setPublishInfo(null)
        history.goBack()
      }
    })
  }
  
  render() {
    const {getFieldDecorator} = this.props.form;
    const {appInfo, history} = this.props;
    // console.log('Publish', appInfo)
    if (!appInfo) {
      history.goBack()
      return null;
    }

    return (
      <div style={{
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '500px',
        overflow: 'scroll',
      }}>
      <div style={{ textAlign:"center" }}>
        <img src={appInfo.get('appIcon')}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '5px',
            verticalAlign: 'middle',
            display: 'inline-block',
          }} alt='icon'
        />
      </div>
      <div style={{ marginTop:'10px', fontSize:'15px'}}>
          版本：{appInfo.get('versionName')}
      </div>
        <Form style={{marginTop: '20px', width: '500px'}} onSubmit={this.handleSubmit}>     
          <FormItem style={{}} label={(
            <span>应用名称&nbsp;</span>
            )}{...formItemLayout}>                       
            <Input type="text" style={{ fontSize:'13px'}}  defaultValue={appInfo.get('appName')} size="small" disabled/>                      
          </FormItem>
          <FormItem label={(
            <span>应用地址&nbsp;</span>
          )}{...formItemLayout}>
            <Input type="text" style={{ fontSize:'13px'}} defaultValue={appInfo.get('downloadPage')} size="small" disabled/>
          </FormItem>
          <FormItem label={(
            <span>版本号&nbsp;</span>
            )}{...formItemLayout}>
            <Input type="text" style={{ fontSize:'13px'}} defaultValue={appInfo.get('versionCode')} size="small" disabled/>
          </FormItem>          
          <FormItem label={(
            <span>灰度比例&nbsp;</span>
            )} {...formItemLayout} style={{verticalAlign: 'middle'}}>
            {getFieldDecorator('publish ratio', { rules: [{ message: '请输入比例' }] })(
              <Fragment>
                <InputNumber min={1} max={100} size="small"
                  value={this.state.publishRatio}
                  style={{width: '43px'}}
                  disabled/> %
                <Slider
                  min={1}
                  max={100}
                  onChange={this.onPublishRatioChange}
                  value={this.state.publishRatio}
                  style={{float: 'right', width: '75%'}}/>
              </Fragment>                          
            )}
          </FormItem>
          <FormItem label={(
            <span>发布方式&nbsp;</span>
          )}{...formItemLayout}>
              <RadioGroup name="radiogroup" defaultValue={0}
              ref={(view) => {this.publishTimeRadio = view}}>
                <Radio value={0}>稍后发布</Radio>
                <Radio value={1}>立即发布</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label={(
            <span>是否增量升级&nbsp;</span>
          )}{...formItemLayout} style={{display: 'none'}}>
              <RadioGroup name="radiogroup" defaultValue={0}
              ref={(view) => {this.patchRadio = view}}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
            </RadioGroup>
          </FormItem>
          {/* <FormItem label={(
              <span>热更新&nbsp;&nbsp;&nbsp;&nbsp;</span>
          )}{...formItemLayout}>
              <RadioGroup name="radiogroup" defaultValue={2}
              ref={(view) => {this.hotUpdateRadio = view}}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>              
            </RadioGroup>      
          </FormItem> */}
          <FormItem label="版本说明" {...formItemLayout}>
            {getFieldDecorator('versionDes', {
              rules: [{required: true, message: '请输入版本说明'}],
            })(
              <TextArea rows={4} ref={(view) => {this.descText = view}}/>
            )}
          </FormItem>
          <FormItem  style={{ float:'right'}}>
            <Button size='large'  type="primary" htmlType="submit" 
              style={{width: '100px'}}>确认</Button>
          </FormItem>
        </Form>
      </div>
    )   
  }
}

const ReleaseVersionForm = Form.create()(Publish);

const mapState = (state) => ({
  appInfo: state.getIn(['app', 'publishInfo']),
})

const mapDispatch = (dispatch) => ({
  toggleSiderNav(show) {
    dispatch(homeCreators.toggleSiderNav(show))
  },
  publishApp(data, callback) {
    dispatch(appCreators.publishApp(data, callback))
  },
  setPublishInfo(data) {
    dispatch(appCreators.setPublishInfo(data))
  }
})

export default connect(mapState, mapDispatch)(ReleaseVersionForm)