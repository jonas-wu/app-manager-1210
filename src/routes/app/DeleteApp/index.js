import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import {message} from 'antd'
import {actionCreators} from '../store'
import './style.css'

class DeleteApp extends PureComponent {
  render() {    
    const {appInfo, deleteAppName, changeName, deleteApp} = this.props
    // console.log('DeleteConfirm', this.props.match.params.id, appInfo)
    if (!appInfo) {
      return (<Redirect to='/'/>)
    }
    return (
      <section style={{
          backgroundColor: '#fff',
          margin: '0 30px 15px',
          boxShadow: '0 1px 3px rgba(33,33,33,.2)',
          display: 'block',
          boxSizing: 'border-box',
          padding: '40px 25px',
          width: '556px',
        }}>
        <div style={{
            padding: '15px',
            backgroundColor: '#f2dede',
            border: '1px solid #ebccd1',
            color: '#a94442',
            borderRadius: '3px',
          }}>
          <div style={{
              color: '#b34b4a',
              fontWeight: '400',
              fontSize: '24px',
              margin: '10px 0'
            }}>删除应用</div>
          <div style={{
              color: '#b34b4a',
              fontSize: '13px',
              marginBottom: '10px'
            }}>
            删除该应用后所有相关的数据（包括所有版本、Crash、反馈等数据）都将被删除<br/>
            删除后不可恢复，请谨慎操作！<br/><br/>
            应用名称
          </div>
          <input type="text" name="title" placeholder="请输入应用名称"
            style={{
              color: '#505458',
              border: '1px solid #e1e1e1',
              fontSize: '13px',
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#fff',
              marginBottom: '8px'
            }} value={deleteAppName} ref={(input) => this.input = input}
            onChange={changeName}/>
            {
              deleteAppName ? null : 
                <div style={{
                    color: '#f44336',
                    fontSize: '13px',
                    marginBottom: '10px'
                  }}>
                  请输入应用名称
                </div>
            }
          <div style={{
              color: '#b34b4a',
              fontSize: '13px',
              marginBottom: '25px'
            }}>
            确认应用名称
          </div>
          <div>
            <button type="submit" className='delete-app-confirm'
              onClick={() => deleteApp(this.input, appInfo)}>删除应用</button>
            <button type="button" className='delete-app-cancel'
              onClick={() => {
                this.props.history.goBack()
              }}>取消</button>
          </div>
        </div>
      </section>
    )    
  }
}

const mapState = (state) => ({
  appInfo: state.getIn(['app', 'appInfo']), 
  deleteAppName: state.getIn(['app', 'deleteAppName']), 
})

const mapDispatch = (dispatch) => ({
  changeName(e) {
    dispatch(actionCreators.changeDeleteAppName(e.target.value))
  },
  deleteApp(input, appInfo) {
    // console.log('deleteApp', input)
    if (!input.value) {
      input.focus()
      return
    }
    if (input.value !== appInfo.get('appName')) {
      message.error('应用名称填写不正确')
      return
    }
    dispatch(actionCreators.deleteApp(appInfo))
  }
})

export default connect(mapState, mapDispatch)(withRouter(DeleteApp))