import React from 'react'
import './down.css'
import {Table,Button,Icon,Spin } from 'antd'
import {actionCreators} from './store'
import { connect } from 'react-redux'


 class DownLoad extends React.Component{


    componentDidMount() {
    
    
     const params = this.props.match.params;
     // console.log("===================lll=====>"+params.appId +"--->"+params.versionId);
     if (!params) {
      this.props.history.goBack()
      return
    }
      this.props.appDownload(params.appId,params.versionId)
      this.setState({
        appId: params.appId,
        versionId:params.versionId
      });

    }


    state = { 
     
      appId:'',
      versionId:'',


    }




  render(){

    
    const {appInfo} = this.props
    //console.log("=======>vale"+appInfo);

     if (!appInfo) {
      
      return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: '50%',
            left: '50%',
          }}>
          <Spin size="large" />
        </div>
      )
    }

    return (
      <div  className="bodyo" >
        
         <div   style={{
               width: '100%',
               margin:'auto'
              }}>
          <img src={appInfo.appIcon}
              alt='icon'
              style={{
              width: '80px',
              height: '80px',
              borderRadius: '5px',
              verticalAlign: 'middle',
              display: 'inline-block',
            }}
          />

         <div className="bodyo" 
               style={{
               marginTop: '50px',
              }}
              >
            <img src={require('../../statics/ic-android.png')}
                 alt='icon'
                 style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '5px',
                  verticalAlign: 'middle',
                  display: 'inline-block',
                }}/>

            <div
               style={{
               display: 'inline-block',
               fontSize:'1.3em',
               marginLeft:'5px'
             }}
               >
          {appInfo.appName}
            </div>
        </div>


         <div
              style={{
              marginTop: '8px',
              textAlign:'center',
              width:'100%',

              }}
            >
          <ul style={{ padding:'0px'}}>
            <li className='liebiao'>版本：{appInfo.versionName}</li>
            <li className='liebiao'>大小：{appInfo.size}</li>
            <li className='liebiao'>上传时间 ：{appInfo.uploadTime} </li>
          </ul>
        </div>


         <div style={{
                  transform: 'scale(1)',
                  transition: 'all .25s ease-in-out',
                  border: '1px solid #eff2f4',
                  padding: '2px',
                  display: 'inline',
                
                }}
                >
              <img  alt='icon' src={appInfo.downloadQR}
                          style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '5px',
                            verticalAlign: 'middle',
                            display: 'inline-block',
                          }}
                        />

        </div> 

        <div
          style={{
            marginTop: '40px',
            }}
        
        >
        <a href={appInfo.downloadUrl}  > 
          <Button 

                type="primary" 
                style={{
                  width:'200px',
                  height:'45px',
                  borderRadius:'25px'
                }}
                onClick={ () => judgeBrowser()}

                >点击安装
          </Button>
          </a>

        </div>


        <div
           
           style={{
            marginTop: '40px',
            }}
        >

            或者用手机扫描二维码安装

        </div>
              
        <div className="bodyo" 
               style={{
               marginTop: '50px',
               width:'100%',
               
              }}
              >
             {
               IsPC()?  this.common('28%',appInfo):  this.common('100%',appInfo)
             }
           
        </div>


        </div>
      </div>

        
    )
  }



  common(widthvalue,appInfo){

    return (

      <div style={{marginTop: '15px',width:widthvalue,margin:'auto'}}>
                    <Table size='samll' rowKey="versionId"  columns={[{
                                          key: 'versionName',
                                          title: '版本',
                                          dataIndex: 'versionName',
                                          width: 70,
                                          render: (text, record) => (
                                            <div style={{
                                              display:'inline-block'
                                            }}>

                                            {String(this.state.versionId) === (String(record.versionId))? 
                                            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"
                                              style={{
                                                marginRight:'5px'
                                              }}
                                             /> :
                                            <Icon type="check-circle"
                                            style={{
                                              marginRight:'5px'
                                            }} />}
                                            
                                            <div
                                              style={{
                                                display: 'inline-block',}}
                                            >{(text)}
                                            </div>

                                            </div>
                                          ),
                                        }, {
                                          title: '上传时间',
                                          dataIndex: 'upgradeDate',
                                          key: 'upgradeDate',
                                          width: 50,
                                        }
                                        ]}
                          dataSource={appInfo.versionList}
                       
                          onRow={(record) => {                  
                            return {                    
                              onClick: () =>{

                                this.props.appDownload(this.state.appId,record.versionId)
                                  this.setState({
                                    
                                          versionId:record.versionId
                                        });
                              }
                            
                              }; 
                            
                            }}
                            
                            locale={{emptyText: '暂无数据'}}
                            pagination={false}
                        
                    />
              </div>


    );
  }


}


function judgeBrowser() {

   if(isWeiXin()){

     alert('点击右上角按钮，然后在弹出的菜单中，点击在浏览器中,打开即可安装')

   }
 
}
function isWeiXin() {

  var ua = window.navigator.userAgent.toLowerCase();
  if (String(ua.match(/MicroMessenger/i)) === String('micromessenger')) {
      return true;
  }
  else {
      return false;
  }
}


function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
              "SymbianOS", "Windows Phone",
              "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  return flag;
}

const mapState = (state) => ({
  appInfo: state.getIn(['appDownLoad', 'appDownLoad']), 
})

const mapDispatch = (dispatch) => ({

  appDownload(appId,versionId) {
    dispatch(actionCreators.appDownload(appId,versionId))
  },


 

})


export default  connect(mapState, mapDispatch)(DownLoad)