import React from 'react';
import Logo from '../../component/logo/logo.js';
import AppStore from '../../store/appStore';
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react/index'
import './login.css';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Form, Icon, Input, Button ,message} from 'antd';
import { API_BASE_URL } from '../../utils/constants'
import md5 from 'js-md5';
import { isAuthenticated } from '../../utils/Session'
import { SERVER } from '../../utils/constants'
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true

const FormItem = Form.Item;


class NormalLoginForm extends React.Component {


  componentDidMount() {
    
     if(isAuthenticated()){
       console.log("=====>login");
      this.props.history.push(SERVER+'/home')
     }


  }



  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      // console.log('Received values of form: ', values);
    //   console.log('Received values of form: md5 value', md5(values.password));
        const userInfo = {}
        userInfo.userName = values.userName;
        userInfo.userPwd = md5(values.password);
      
          axios({
            method: "post",
            url: "/user/login",
            data: userInfo,
            // headers: {
            //   'Content-Type':'application/x-www-form-urlencoded'
             
            // },
            // transformRequest: [function (data) {
            //   let ret = ''
            //   for (let it in data) {
            //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            //   }
            //   return ret
            // }]

        }).then((res) => {
            // console.log("====>"+res.data.code);
            // console.log("====>"+res.data.msg);
            

            var loginVerify = res.data.code;
            switch (loginVerify){
                case 0:
               // console.log("====>"+res.data.content.userType);
                message.info(res.data.msg);
                AppStore.toggleLogin(true, {username: userInfo.userName,userType:res.data.content.userType})
                //页面跳转到首页
                // const {from} = this.props.location.state || {from: {pathname: '/'}}
                this.props.history.push(SERVER+'/home')

                    break;
                
                default:
                message.info(res.data.msg);
                    break;
            }


        })
       
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (

      <div className="login-body">
       <Logo></Logo>
      <Form onSubmit={this.handleSubmit} className="login-form" >
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入账号!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
         
         
          <Button type="primary" htmlType="submit" className="login-form-button">
           登录
          </Button>
         
        </FormItem>
      </Form>


        </div>
    );
  }
}


const WrappedNormalLoginForm = observer(Form.create()(NormalLoginForm));

export default withRouter(WrappedNormalLoginForm);
