import React from 'react'
import CustomMenu from "../CustomMenu/index";
import { userType } from '../../utils/Session'
import './logo.css';
import { SERVER } from '../../utils/constants'
const menus = [
  {
    title: '概述',
    icon: 'home',
    key: SERVER+'/home'
  },
 
  {
    title: '账号设置',
    icon: 'bars',
    key: SERVER+'/home/navigation',
    subs: [
      {key: SERVER+'/home/navigation/dropdown', title: '修改密码', icon: ''},
     
    ]
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: SERVER+'/home/about'
  }
]


const menusSuper = [
  {
    title: '概述',
    icon: 'home',
    key: SERVER+'/home'
  },
 
  {
    title: '账号设置',
    icon: 'bars',
    key: SERVER+'/home/navigation',
    subs: [
      {key: SERVER+'/home/navigation/dropdown', title: '修改密码', icon: ''},
      {key: SERVER+'/home/navigation/menu', title: '新建账号', icon: ''},
      {key: SERVER+'/home/navigation/steps', title: '账号管理', icon: ''},
    ]
  },
  {
    title: '关于',
    icon: 'info-circle-o',
    key: SERVER+'/home/about'
  }
]


class SiderNav extends React.Component {
  render() {
    return (
      <div style={{height: '100vh'}}>
        <div className="logo" style={{backgroundImage:"url(" + require("../../statics/logobg.png") + ")"}}>
          <h2 style={{ display:'inherit' ,color:'#fff',fontSize:'25px',textDecoration: 'none'}}><img   style={{width:'40px',height:'40px'}} src={require('../../statics/logo.png') }  alt="logo"/>&nbsp;摩羯</h2>
        </div>
        {
          userType() === '1'?  <CustomMenu menus={menusSuper}/>:
          <CustomMenu menus={menus}/>
        }       
      </div>
    )
  }
}



export default SiderNav