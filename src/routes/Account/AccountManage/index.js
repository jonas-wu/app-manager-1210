import React from 'react'
import {Modal,Table,Divider,Button,Spin } from 'antd'
import {actionCreators} from '../store'
import { connect } from 'react-redux'
const confirm = Modal.confirm;

function showConfirm(userId,resetAccount) {
 
  confirm({
    title: '账号管理',
    content: '确定重置该用户?',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      console.log('OK');
      resetAccount(userId);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

function showDeleteConfirm(userId,deleteAccount) {
  
  confirm({
    title: '账号管理',
    content: '确定删除该用户?',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      console.log('OK');
      deleteAccount(userId);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

 class Account extends React.Component{

  componentDidMount() {
   
    this.props.getAccountList()
  }

  render(){

    const {account} = this.props;

    if (!account) {
      return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            margin: '-80px 0 0 80px',
          }}>
          <Spin size="large"/>
        </div>
      )
    }


   
    return (
     
      <div style={{background: '#ffffff', marginTop: 10,width:'100%'}}>
      <Table size='samll' rowKey="userId" columns={[
  
                  {
                  key: 'userName',
                  title: '用户名',
                  dataIndex: 'userName',
                  width:250,
                  align:'center'
                 
                }, {
                  title: '邮箱',
                  dataIndex: 'userMail',
                  width:250,
                  key: 'userMail',
                  align:'center'
                }, {
                  title: '操作',
                  dataIndex: 'accountOpr',
                  key: 'accountOpr',
                  width: 200,
                  align:'center',
               
                  render: (text, record) => { 
                    return (    
                    <span>
                      <Button type="primary" onClick={ () => showConfirm(record.userId,this.props.resetAccount)}>重置</Button>
                      <Divider type="vertical" />
                      {
                        record.userType === 2 ? <Button type="danger"   onClick={ () => showDeleteConfirm(record.userId,this.props.deleteAccount)}>删除</Button> : 
                        <Button type="danger"   disabled={true} >删除</Button>
                      }
                      
                    
                    </span>
                  )},

                }]}
             dataSource={account}
             scroll={{x: 800}}
             locale={{emptyText: '暂无数据'}}
             pagination={false}
      />
      </div>
    )
  }
}


const mapState = (state) => ({
  account: state.getIn(['account', 'accountList']), 
})

const mapDispatch = (dispatch) => ({
  getAccountList() {
    dispatch(actionCreators.getAccountList())
  },

  deleteAccount(userId){

    dispatch(actionCreators.deleteAccount(userId))
  },


  resetAccount(userId){

    dispatch(actionCreators.resetAccount(userId))
  }

})

export default connect(mapState, mapDispatch) (Account);