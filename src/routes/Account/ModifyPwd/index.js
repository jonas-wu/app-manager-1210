import React from 'react'
import {Card, Form, Input, Button,message} from 'antd'
import 'antd/dist/antd.css';
import axios from 'axios';
import md5 from 'js-md5';
import { ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'
import { SERVER } from '../../../utils/constants'
const FormItem = Form.Item


class Modify extends React.Component{

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },(err, values) => {
      if (!err) {

    
        const userInfo = {}
        userInfo.userPwdOld = md5(values.passwordold);
        userInfo.userPwd = md5(values.password);

        axios({
            method: "post",
            url: "/user/pwdUpdate",
            data: userInfo,
           

        }).then((res) => {
           
            if (res.data.code === ERR_CODE_SUCCESS) {
              AppStore.toggleLogin(false);
              const {from} = this.props.location.state || {from: {pathname: SERVER+'/login'}}
              this.props.history.push(from)
            } else if( res.data.code === ERR_CODE_NOT_LOGIN){
              AppStore.toggleLogin(false);
            }
             message.success(res.data.msg);

        })
       
      }
    });
  }

  render(){

    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
      span: 12,
      },
      wrapperCol: {
        span: 12,
        
      },
    };
 


    return (
      <div style={{textAlign:'center',width:'100%'}}>
      
         <Card  style={{textAlign:'left'}} bordered={false} title='修改密码'>
       
          <Form layout='horizontal' style={{width: '40%',marginLeft:'20%'}} onSubmit={this.handleSubmit}>


             <FormItem label='旧密码' {...formItemLayout}>
              {
                getFieldDecorator('passwordold', {
                  rules: [
                    {
                      required: true,
                      message: '请输入旧密码'
                    },
                    {
                      min: 6,
                      message: '密码至少为6个字符'
                    },
                    {
                      max: 16,
                      message: '密码最多为16个字符'
                    },
                    {
                      whitespace: true,
                      message: '密码中不能有空格'
                    }
                  ],
                  validateTrigger: 'onSubmit'
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>
            
            <FormItem label='新密码' {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码'
                    },
                    {
                      min: 6,
                      message: '密码至少为6个字符'
                    },
                    {
                      max: 16,
                      message: '密码最多为16个字符'
                    },
                    {
                      whitespace: true,
                      message: '密码中不能有空格'
                    },
                    // {
                    //   validator: (rule, value, callback) => {
                    //     const {getFieldValue} = this.props.form

                      
                    //      console.log('confirm----->'+getFieldValue('confirm'));
                    //       if (value && value !== getFieldValue('confirm')) {
                    //         callback('两次输入不一致！')
                    //       }
                    //       callback()
                       
                        
                    //   }
                    // }
                  ],
                  validateTrigger: 'onSubmit'
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>

            <FormItem   label='确认密码' {...formItemLayout} required>
              {
                getFieldDecorator('confirm', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                       // console.log('ooooooo');
                        const {getFieldValue} = this.props.form
                        if (!getFieldValue('password')) {
                          callback('请再次输入新密码')
                        }
                      //  console.log(value+'--------------'+getFieldValue('password'))
                        if (value && value !== getFieldValue('password')) {
                          callback('两次输入不一致！')
                        }
                        callback()
                      }
                    }
                  ],
                  validateTrigger: 'onSubmit'
                })(
                  <Input type='password'/>
                )
              }
            </FormItem>
            
            
            <FormItem style={{textAlign: 'right',marginRight:'18%'}} >
              <Button type="primary" htmlType="submit"style={{ height:'35px'}}>确认修改</Button>
            </FormItem>
          </Form>
        
        </Card>

      </div>
    )
  }
}


const modify =  Form.create()(Modify);
export default modify;