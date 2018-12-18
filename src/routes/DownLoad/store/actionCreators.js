import { constants } from './index'
import axios from 'axios'
import { message } from 'antd';
import { ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'

export const setAppDownload = (data) => ({
  type: constants.APPDOWNLOAD,
  data
});


export const appDownload = (appId,versionId) => {

  const appInfo = {}
  appInfo.appId = appId;
  appInfo.versionId = versionId;
  return (dispatch) => {
    axios({
      method: "post",
      url: "/app/appDownload",
      data: appInfo
    })
    .then((res) => {
     
     // console.log("---->result"+res.data.content);
      if (res.data.code === ERR_CODE_SUCCESS) {
       
        dispatch(setAppDownload(res.data.content))
        return ;
      }
      
      
      if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }

      message.success(res.data.msg ? res.data.msg :'获取应用版本列表失败')
      

    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}

