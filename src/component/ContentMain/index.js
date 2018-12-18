import React from 'react'
import { withRouter, Switch } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import { Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Error404 from '../../component/Error404'
import { SERVER } from '../../utils/constants'

const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分
//基本组件Demo
const ButtonDemo = LoadableComponent(()=>import('../../routes/General/ButtonDemo/index'))
const IconDemo = LoadableComponent(()=>import('../../routes/General/IconDemo/index'))

//账户设置组件Demo
const AccountManage = LoadableComponent(()=>import('../../routes/Account/AccountManage/index'))
const CreateAccount = LoadableComponent(()=>import('../../routes/Account/CreateAccount/index'))
const ModifyPwd = LoadableComponent(()=>import('../../routes/Account/ModifyPwd/index'))

//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

const AppDetail = LoadableComponent(()=>import('../../routes/app/AppDetail'))
const AppPublish = LoadableComponent(()=>import('../../routes/app/AppPublish'))
const Publish = LoadableComponent(()=>import('../../routes/app/AppPublish/publish'))

//下载界面
//const DownLoad = LoadableComponent(()=>import('../../routes/DownLoad/index'))

class ContentMain extends React.Component {
  render () {
    return (
      <div style={{padding: 16, position: 'relative'}}>
        
        <Switch>
          <PrivateRoute exact path={SERVER+'/'} component={Home}/>
          <PrivateRoute exact path={SERVER+'/home'} component={Home}/>
          <Route exact path='/home/general/button' component={ButtonDemo}/>
          <Route exact path='/home/general/icon' component={IconDemo}/>


          <PrivateRoute exact path={SERVER+'/home/navigation/dropdown'} component={ModifyPwd}/>
          <PrivateRoute exact path={SERVER+'/home/navigation/menu'} component={CreateAccount}/>
          <PrivateRoute exact path={SERVER+'/home/navigation/steps'} component={AccountManage}/>
          <PrivateRoute exact path={SERVER+'/home/about'} component={About}/>
          <PrivateRoute exact path={SERVER+'/appdetail/:id'} component={AppDetail}/>
          <PrivateRoute exact path={SERVER+'/apppublish'} component={AppPublish}/>
          <PrivateRoute exact path={SERVER+'/publish'} component={Publish}/>
         {/*  <Route exact path='/downLoad/:appId/:versionId' component={DownLoad}/> */}
          <Route component={() => <Error404/>}/>
        </Switch>

      </div>
    )
  }
}

export default withRouter(ContentMain)