import React from 'react'
import { Icon, Badge, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { isAuthenticated } from '../../utils/Session'
import AppStore from '../../store/appStore';
import * as actionCreators from '../../store/actionCreators'
import { SERVER } from '../../utils/constants'

//withRouter一定要写在前面，不然路由变化不会反映到props中去

class HeaderBar extends React.PureComponent {
  state = {
    icon: 'arrows-alt',
    count: 100,
    visible: false,
    avatar: require('../../statics/04.jpg')
  }

  componentDidMount () {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  componentWillUnmount () {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {
    //登出
    AppStore.toggleLogin(false)
    this.props.logout()
    this.props.history.push(SERVER+'/login')
  }

  render () {
    const {count, visible, avatar} = this.state
    const {location} = this.props
    const notLogin = (
      <div>
        <Link to={{pathname: SERVER+'/login', state: {from: location}}} style={{color: 'rgba(0, 0, 0, 0.65)'}}>登录</Link>&nbsp;
        <img src={require('../../statics/defaultUser.jpg')} alt=""/>
      </div>
    )
    const menu = (
      <Menu className='menu' style={{ paddingBottom:'10px',paddingRight:'40px',width:'200px',float:'right'}}>
        <Menu.ItemGroup title='' className='menu-group' >
         {/*  <Menu.Item>你好 - {isAuthenticated()}</Menu.Item> */}
          <Menu.Item onClick={this.logout}><span >退出登录</span></Menu.Item>
        </Menu.ItemGroup>
        
      </Menu>
    )
    const login = (
      <Dropdown   overlay={menu}>
     <h3 style={{ float:'right',marginRight:'10px'}}> {isAuthenticated()}  <img src={avatar} alt=""/></h3>
      </Dropdown>
    )
    return (
      <div id='headerbar'>
        {/* <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className='trigger'
          onClick={this.toggle}/> */}
        <div style={{ float: 'right'}}>
          <ul className='header-ul' style={{width:'100%'}}>
           
            <li  style={styles.liDisplay} onClick={() => this.setState({count: 0})}>
              <Badge count={AppStore.isLogin ? count : 0} overflowCount={99} style={{marginLeft: 17}}>
                <Icon type="notification"/>
              </Badge>
            </li>
            <li>
              {AppStore.isLogin ? login : notLogin}
            </li>
          </ul>
        </div>
        <Modal
          footer={null} closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({visible: false})}>
          <img src={avatar} alt="" width='100%'/>
        </Modal>
      </div>
    )
  }
}

const styles = {

  liDisplay: {
    // transform: 'scale(0.7)',
    display: 'none'
    
  }


}

const mapDispatch = (dispatch) => ({
  logout() {
    dispatch(actionCreators.logout())
  },
})

const WrappedNormalHeaderBar = connect(null, mapDispatch)(HeaderBar)

export default withRouter(WrappedNormalHeaderBar);