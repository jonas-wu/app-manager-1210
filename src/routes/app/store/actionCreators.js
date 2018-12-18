import axios from 'axios'
import { message } from 'antd'
import { constants } from './index'
import { API_BASE_URL, ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'

axios.defaults.baseURL = API_BASE_URL;

const HTTP_METHOD = 'post'

export const changeDeleteAppName = (data) => ({
  type: constants.CHANGE_DELETE_APP_NAME,
  data
})

const setAppInfo = (data) => ({
  type: constants.SET_APP_INFO,
  data
})

const setAppHistory = (data) => ({
  type: constants.SET_APP_HISTORY,
  data
})

export const setPublishInfo = (data) => ({
  type: constants.SET_PUBLISH_INFO,
  data
})

export const initUpload = () => {
  return (dispatch) => {
    dispatch(setPublishInfo(null))
  }
}

export const getAppDetail = (id, callback) => {
  return (dispatch) => {
    dispatch(setAppInfo(null))

    const reqData = {appId: id}
    axios({
      method: HTTP_METHOD,
      url: "/app/appDetail",
      data: reqData
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        dispatch(setAppInfo(data.content))
        callback(true)
        return
      }
      
      message.error(data.msg ? data.msg : '获取应用信息失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const getAppHistory = (id, callback) => {
  return (dispatch) => {
    // dispatch(setAppHistory(null))

    const reqData = {appId: id}
    axios({
      method: HTTP_METHOD,
      url: "/app/appVersion",
      data: reqData
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        dispatch(setAppHistory(data.content))
        callback(true, data.content.length)
        return
      }
      
      message.error(data.msg ? data.msg : '获取应用发布记录失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const deleteApp = (appInfo, callback) => {
  return (dispatch) => {
    const reqData = {
      appId: appInfo.get('appId'),
      appName: appInfo.get('appName'),
    }
    axios({
      method: HTTP_METHOD,
      url: "/app/appDelete",
      data: reqData
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        if (data.msg) {
          message.success(data.msg)
        }
        dispatch(setAppInfo(null))
        dispatch(changeDeleteAppName(''))
        callback(true)
        return
      }
      
      message.error(data.msg ? data.msg : '应用删除失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const uploadFile = (file, callback) => {
  return (dispatch) => {
    dispatch(setPublishInfo(null))

    const formData = new FormData()
    formData.append('file', file)
    axios.post('/app/appUpload', formData, {
        onUploadProgress: (e) => {
          // console.log('onUploadProgress', e)
          if (e && e.type === 'progress') {
            callback({
              state: constants.UPLOAD_STATUS_ACTIVE,
              loadedSize: e.loaded, 
              totalSize: e.total,
            })
          }
        }
      })
      .then((res) => {
        const data = res.data;
        if (data.code === ERR_CODE_SUCCESS) {
          dispatch(setPublishInfo(res.data.content))
          callback({state: constants.UPLOAD_STATUS_SUCCESS, data: res.data.content})
          return
        }
        callback({state: constants.UPLOAD_STATUS_ERROR, msg: data.msg ? data.msg : '应用上传失败'})
        message.error(data.msg ? data.msg : '应用上传失败')
        if (data.code === ERR_CODE_NOT_LOGIN) {
          AppStore.toggleLogin(false)
        }
      })
      .catch((err) => {
        console.log(err)
        callback({state: constants.UPLOAD_STATUS_ERROR, msg: err.message})
      })
  }
}

export const publishApp = (appInfo, callback) => {
  return () => {
    axios({
      method: HTTP_METHOD,
      url: "/app/appPublish",
      data: appInfo,
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        if (data.msg) {
          message.success(data.msg)
        }
        callback(true)
        return
      }
      
      message.error(data.msg ? data.msg : '应用发布失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const changeAppInfo = (appId, data, callback) => {
  return () => {
    axios({
      method: "post",
      url: "/app/appVersionUpdate",
      data
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        message.success(data.msg)
        callback(true)
        return
      }

      message.error(data.msg ? data.msg : '操作失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const deleteAppVersion = (appId, versionId, callback) => {
  return () => {
    const reqData = {versionId}
    axios({
      method: HTTP_METHOD,
      url: "/app/appVersionDelete",
      data: reqData
    })
    .then((res) => {
      const data = res.data;
      if (data.code === ERR_CODE_SUCCESS) {
        message.success(data.msg)
        // dispatch(getAppHistory(appId))
        callback(true)
        return
      }

      message.error(data.msg ? data.msg : '版本删除失败')
      if (data.code === ERR_CODE_NOT_LOGIN) {
        AppStore.toggleLogin(false)
      }
      callback(false)
    })
    .catch((err) => {
      console.log(err)
      message.error(err.message)
      callback(false)
    })
  }
}

export const setAppDetailPageLoading = (data) => ({
  type: constants.SET_APP_DETAIL_PAGE_LOADING,
  data
})