import React from 'react'
import { Route, Redirect, } from 'react-router-dom'
import { isAuthenticated } from '../../utils/Session'
import { SERVER } from '../../utils/constants'
import AppStore from '../../store/appStore'

class PrivateRoute extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isLogin: isAuthenticated()}
  }
  
  componentWillMount() {
    AppStore.addListener(this.logout)
  }

  componentWillUnmount() {
    AppStore.removeListener(this.logout)
  }

  logout = () => {
    // console.log('logout')
    this.setState({isLogin: false})
  }

  render() {
    const {component: Component, ...rest} = this.props
    return (
      <Route {...rest} render={(props) => (
        this.state.isLogin
          ? <Component {...props} />
          : <Redirect to={{
            pathname: SERVER+'/login',
            state: {from: props.location}
          }}/>
      )}/>
    )
  }
}

export default PrivateRoute