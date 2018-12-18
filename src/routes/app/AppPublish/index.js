import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import {actionCreators, constants} from '../store'
import {actionCreators as homeCreators} from '../../Home/store'
import { Icon, Progress, Button, message } from 'antd';
import Dropzone from 'react-dropzone'
import './style.css'
import { SERVER } from '../../../utils/constants'

// Dropzone.options.myAwesomeDropzone = {
//   acceptedFiles: 'image/*'
// }

class AppPublish extends PureComponent {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.getDropFileWrapper = this.getDropFileWrapper.bind(this)
    this.getPercentWrapper = this.getPercentWrapper.bind(this)

    this.state = {
      file: null,
      state: constants.UPLOAD_STATUS_NORMAL,
      loadedSize: 0,
      totalSize: 1,
      response: '',
      errMsg: '',
      dragOver: false,
    }
  }

  componentDidMount() {
    // console.log('AppPublish componentDidMount')
    this.props.initUpload()
  }

  render() {
    return (
      <div>
        <div style={{
            position: "relative",
            padding: '10px 15px 6px',
            margin: '0 auto 20px',
            width: '970px',
            boxSizing: 'border-box',
            // background: '#aaa',
            overflow: 'hidden',
          }}>
          <div style={{
              color: '#666',
              fontSize: '22px',
              float: 'left',
              fontWeight: '400',
              lineHeight: '35px',
            }}>发布应用</div>
          <div style={{
              color: '#555',
              fontSize: '13px',
              float: 'right',
              lineHeight: '35px',
            }}>发布应用，仅需两步</div>
        </div>
        {this.getUploadWrapper()}
      </div>      
    )   
  }

  onDrop(acceptFiles, rejectFiles) {
    console.log('onDrop', acceptFiles, rejectFiles)
    this.setState({dragOver: false})
    let file = null;
    if (acceptFiles !== null && acceptFiles.length > 0) {
      file = acceptFiles[0]
    } else if (rejectFiles !== null && rejectFiles.length > 0) {
      file = rejectFiles[0]
    }
    if (file === null) {
      message.error('文件类型错误')
      return
    }
    
    if (file.type !== 'application/vnd.android.package-archive') {
      const type = getFileType(file.name)
      if (!type || type.toLowerCase() !== '.apk') {
        message.error('文件类型必须是apk')
        return
      }
    }
    this.setState({file: file})

    this.props.uploadFile(file, (data) => {
      // console.log('uploadFile callback', data)
      switch(data.state) {
        case constants.UPLOAD_STATUS_ACTIVE:
          this.setState({state: data.state, loadedSize: data.loadedSize, totalSize: data.totalSize})
          break
        case constants.UPLOAD_STATUS_SUCCESS:
          this.setState({state: data.state, response: data.data})
          this.props.history.push(SERVER+'/publish')
          break
        case constants.UPLOAD_STATUS_ERROR:
          this.setState({state: data.state, errMsg: data.msg})
          break
        default:
          break
      }
    })
  }

  getUploadWrapper() {
    const {file, state, loadedSize, totalSize, errMsg, dragOver} = this.state
    let dom;
    switch(state) {
      case constants.UPLOAD_STATUS_NORMAL:
        dom = this.getDropFileWrapper(' 立刻上传', '点击按钮选择应用的安装包（apk文件），或拖拽文件到此区域')
        break
      case constants.UPLOAD_STATUS_ACTIVE:
        dom = this.getPercentWrapper(null, (loadedSize < totalSize 
          ? `正在上传 ${file.name} (${(parseFloat(totalSize) / 1024.0 / 1024.0).toFixed(1)}M)` 
          : `正在分析 ${file.name}, 请稍后...`))
        break
      case constants.UPLOAD_STATUS_SUCCESS:
        dom = this.getPercentWrapper('继续上传', '上传成功 ' + file.name)
        break
      case constants.UPLOAD_STATUS_ERROR:
        dom = this.getPercentWrapper('重新上传', `${errMsg} (${file.name})`)
        break
      default:
        return null
    }

    return (
      <Dropzone onDrop={this.onDrop} disabled={state === constants.UPLOAD_STATUS_ACTIVE}
        className={state === constants.UPLOAD_STATUS_ACTIVE 
          ? 'drop-wrapper drop-wrapper-disabled' 
          : (dragOver ? 'drop-wrapper drop-wrapper-dragover' : 'drop-wrapper')}
        onDragEnter={() => {
          this.setState({dragOver: true})
        }}
        onDragLeave={() => {
          this.setState({dragOver: false})
        }}
        accept='application/vnd.android.package-archive'
        ref={(view) => {this.drapZone = view}}>
        {dom}
      </Dropzone>
    )
  }

  getDropFileWrapper(btnName, content) {
    return (
      <div>
        <Button size='large' type='primary' style={{
            marginBottom: '20px',
          }}>
          <Icon type="upload" />
          {btnName}
        </Button>
        <div style={{
            fontSize: '14px',
            color: '#333',
          }}>
          {content}
        </div>
      </div>
    ) 
  }

  getPercentWrapper(btnName, content) {
    const {state, loadedSize, totalSize} = this.state
    let btn = null;
    if (btnName) {
      btn = 
        <div>
          <Button type='primary' style={{
            marginBottom: '20px',
          }}>{btnName}</Button>
        </div>
    }

    return (
      <div>
        <Progress type="circle" percent={Math.ceil(loadedSize * 100 / totalSize)}
          status={state === constants.UPLOAD_STATUS_SUCCESS 
            ? 'success' : (state === constants.UPLOAD_STATUS_ERROR
              ? 'exception' : 'active')} 
          style={{
            display: 'block',
            marginBottom: '20px',
          }}/>
        {btn}
        <div style={{
            fontSize: '14px',
            color: '#333',
          }}>
          {content}
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  appInfo: state.getIn(['app', 'appInfo'])
})

const mapDispatch = (dispatch) => ({
  toggleSiderNav(show) {
    dispatch(homeCreators.toggleSiderNav(show))
  },
  initUpload() {
    dispatch(actionCreators.initUpload())
  },
  uploadFile(file, callback) {
    dispatch(actionCreators.uploadFile(file, callback))
  },
})

function getFileType(name) {
  const i = name.lastIndexOf('.')
  if (i < 0) {
    return null
  }
  return name.substring(i)
}

export default connect(mapState, mapDispatch)(AppPublish)