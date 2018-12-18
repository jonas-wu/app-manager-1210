import { constants } from './index'
import { message } from 'antd';
import axios from 'axios';
import { ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'


message.config({
  top: 300,
  duration: 2,
  maxCount: 3,
});

export const setAppList = (data) => ({
  type: constants.GET_APP_LIST,
  data
});


export const getAppList = () => {
  
  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/summary",
      data: {
    
      }
    })
    .then((res) => {
    //console.log('getAppList---->', res.data.content)
      if (res.data.code === ERR_CODE_SUCCESS) {
        dispatch(setAppList(res.data.content))
        return;
      } 
      
      if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

      message.success(res.data.msg ? res.data.msg :'获取应用列表失败')
       
    })
    .catch((err) => {
      console.log(err)
      AppStore.toggleLogin(false);
      message.success('服务器异常')
    })
  }
}


export const appUpdateStatus = (versionId,isForce) => {

  const updateStatus ={};
  updateStatus.versionId = versionId;
  updateStatus.isForce = isForce;

  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appVersionUpdate",
      data: updateStatus
    })
    .then((res) => {
   //   console.log('appUpdateStatus---->', res.data.msg)
      if (res.data.code === ERR_CODE_SUCCESS) {
       
        dispatch(getAppList());
      } else if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

        message.success(res.data.msg)
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}

export const appPublishStatus = (versionId,isPublish) => {

  const publishStatus ={};
  publishStatus.versionId = versionId;
  publishStatus.isPublish = isPublish;

  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appVersionUpdate",
      data: publishStatus
    })
    .then((res) => {
  //    console.log('appPublishStatus---->', res.data.code)
      if (res.data.code === ERR_CODE_SUCCESS) {
       
        dispatch(getAppList());
      } else if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

        message.success(res.data.msg)
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}


export const appDelete = (appId,appName) => {

  const appDeleteStatus ={};
  appDeleteStatus.appId = appId;
  appDeleteStatus.appName = appName;

//  console.log('appDelete appid name ---->', appId + appName)
  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appDelete",
      data: appDeleteStatus
    })
    .then((res) => {
 //     console.log('appDelete---->', res.data.code)
      if (res.data.code === ERR_CODE_SUCCESS) {
       
        dispatch(getAppList());
      } else if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

        message.success(res.data.msg)
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}



export const appDescUpdate = (versionId,upgradeDesc) => {

  const descUpdate ={};
  descUpdate.versionId = versionId;
  descUpdate.upgradeDesc = upgradeDesc;

  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appVersionUpdate",
      data: descUpdate
    })
    .then((res) => {
      
      if (res.data.code === ERR_CODE_SUCCESS) {
      
        dispatch(getAppList());
      } else if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

        message.success(res.data.msg)
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}


export const appGaryUpdate = (versionId,grayscale) => {

  const garyUpdate ={};
  garyUpdate.versionId = versionId;
  garyUpdate.grayscale = grayscale;

  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appVersionUpdate",
      data: garyUpdate
    })
    .then((res) => {
      
      if (res.data.code === ERR_CODE_SUCCESS) {
       
        dispatch(getAppList());
      } else if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

        message.success(res.data.msg)
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}