import {observable, action,decorate} from 'mobx'
import {isAuthenticated,authenticateSuccess,logout} from '../utils/Session'

class AppStore {
   isLogin = !!isAuthenticated()  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
   loginUser = {}  //当前登录用户信息

    toggleLogin(flag,info={}) {
    this.loginUser = info  //设置登录用户信息
    if (flag) {
      authenticateSuccess(info.username,info.userType)
      this.isLogin = true
    } else {
      logout()
      this.isLogin = false
      this.notifyLogout()
    }
  }

  loginListeners = []
  
  addListener(listener) {
    if (listener) {
      this.loginListeners.push(listener)
      // console.log('addListener', this.loginListeners)
    }
  }

  removeListener(listener) {
    if (listener) {
      let i = this.loginListeners.indexOf(listener)
      if (i >= 0) {
        this.loginListeners.splice(i, 1)
        // console.log('removeListeners', this.loginListeners)
      }      
    }
  }

  notifyLogout() {
    this.loginListeners.forEach(listener => listener())
  }  
}


decorate(AppStore, {
  isLogin: observable,
  loginUser: observable,
  toggleLogin: action
})


export default new AppStore()