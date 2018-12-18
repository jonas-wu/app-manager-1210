import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'
import store from './store'
import './index.css';
import Login from './routes/Login/login.js';
import Index from './routes/Index/index.js';
import PrivateRoute from './component/PrivateRoute'
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import LoadableComponent from './utils/LoadableComponent'
import { SERVER } from './utils/constants'


//下载界面
const DownLoad = LoadableComponent(()=>import('./routes/DownLoad/index'))
//ReactDOM.render(<Login />, document.getElementById('root'));


ReactDOM.render(
  <Provider store={store}>
    <Router>
    <Switch>
      <Route path={SERVER+'/login' }component={Login}/>
      <Route exact path={SERVER+'/appDownload/:appId/:versionId'} component={DownLoad}/>
      <PrivateRoute path='/' component={Index}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
