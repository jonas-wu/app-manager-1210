import React from 'react'
import {Card,Form,  Input, Button} from 'antd'
import 'antd/dist/antd.css';
import axios from 'axios';
import { message } from 'antd';
import { ERR_CODE_SUCCESS, ERR_CODE_NOT_LOGIN } from '../../../utils/constants'
import AppStore from '../../../store/appStore'
import { SERVER } from '../../../utils/constants'

const FormItem = Form.Item
 class Modify extends React.Component{


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        const userInfo = {}
        userInfo.userName = values.nickname;
        userInfo.userMail = values.email;

        axios({
            method: "post",
            url: "/user/createUser",
            data: userInfo,
          
        }).then((res) => {
          

            if (res.data.code === ERR_CODE_SUCCESS) {
            
              this.props.history.push(SERVER+'/home/navigation/steps');
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
      
         <Card style={{textAlign:'left'}} bordered={false} title='修改密码'>
         
          <Form layout='horizontal' style={{width: '40%',marginLeft:'20%'}} onSubmit={this.handleSubmit}>

            <FormItem {...formItemLayout} label={(
              <span>
                用户名&nbsp;
                {/* <Tooltip title='请输入用户名'>
                  <Icon type='question-circle-o'/>
                </Tooltip> */}
              </span>
            )}>
              {
                getFieldDecorator('nickname', {
                  rules: [ {
                    required: true,
                    message: '请填写用户名'
                  },
                  {
                    validator: this.compareChinese,
                   
                  },
                  {

                    validator: this.compareLength,
                  }
                
                ],
                validateTrigger: 'onSubmit'


                }
               
                
                
                )(
                  <Input/>
                )
              }
            </FormItem>


            <FormItem label={(
              <span>
                邮箱&nbsp;
               {/*  <Tooltip title='请输入邮箱'>
                  <Icon type='question-circle-o'/>
                </Tooltip> */}
              </span>
            )} {...formItemLayout}>
              {
                getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址'
                    },
                    {
                      required: true,
                      message: '请填写邮箱地址'
                    },
                    {

                      validator: this.compareMailLength,
                    }
                  ],
                  validateTrigger: 'onSubmit'
                })(
                  <Input/>
                )
              }
            </FormItem>
           
           
            
            <FormItem style={{textAlign: 'right',marginRight:'18%'}} >
              <Button type="primary" htmlType="submit" style={{ height:'35px'}}>创建账号</Button>
            </FormItem>
          </Form>
        </Card>

      </div>
    )
  }

  compareChinese = (rule, value, callback) => {
   
    const reg = /[\u4E00-\u9FA5]{1,4}/;   /*定义验证表达式*/
    if (reg.test(value)) { /*进行验证*/
      callback('账号不能为中文');
      return;
    }
    callback();

   }

   compareLength = (rule, value, callback) => {
   
    if (strlen(value)>15) { /*进行验证*/
      callback('账号过长');
      return;
    }
    callback();

   }
   compareMailLength = (rule, value, callback) => {
   
    if (strlen(value)>25) { /*进行验证*/
      callback('邮箱过长');
      return;
    }
    callback();

   }

}


function strlen(str){
  if(!str){

    return;
  }
  var len = 0;
  for (var i=0; i<str.length; i++) { 
   var c = str.charCodeAt(i); 
  //单字节加1 
   if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
     len++; 
   } 
   else { 
    len+=2; 
   } 
  } 
  return len;
}


const modify =  Form.create()(Modify);
export default modify;