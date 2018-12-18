import { constants } from './index'
import axios from 'axios'
import { message } from 'antd';
import { ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'

export const setAccountList = (data) => ({
  type: constants.ACCOUNTLIST,
  data
});


export const getAccountList = () => {
  return (dispatch) => {
    axios({
      method: "post",
      url: "/user/userList",
      data: {
    
      }
    })
    .then((res) => {
     
      if (res.data.code === ERR_CODE_SUCCESS) {
        dispatch(setAccountList(res.data.content))
        return ;
      }  
      
      if( res.data.code === ERR_CODE_NOT_LOGIN){
        AppStore.toggleLogin(false);
      }
      message.success(res.data.msg ? res.data.msg :'获取账户列表失败')
      
    })
    .catch((err) => {
      console.log(err)
      
    })
  }
}


export const deleteAccount = (id) => {

  const userDelete = {}
  userDelete.userId = id;
 
  return (dispatch) => {
    axios({
      method: "post",
      url: "/user/userDelete",
      data: userDelete,
    })
    .then((res) => {

     
      if (res.data.code === ERR_CODE_SUCCESS) {
        
        dispatch(getAccountList())
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



export const resetAccount = (id) => {
  const userReset = {}
  userReset.userId = id;
  return (dispatch) => {
    axios({
      method: "post",
      url: "/user/userPwdReset",
      data:userReset,
    })
    .then((res) => {
     
      if (res.data.code === ERR_CODE_SUCCESS) { 
      
       dispatch(getAccountList())
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
