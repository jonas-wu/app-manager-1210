import React from 'react'
import {Layout} from 'antd'
import { connect } from 'react-redux'
import SiderNav from '../../component/SiderNav'
import ContentMain from '../../component/ContentMain'
import HeaderBar from '../../component/HeaderBar'


const {Sider, Header, Content, Footer} = Layout


class Index extends React.Component{
  state = {
    collapsed: false
  }

  toggle = () => {
    // console.log(this)  状态提升后，到底是谁调用的它
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render() {
    // 设置Sider的minHeight可以使左右自适应对齐
    return (
      <div id='page'>
        <Layout>
          {
            this.props.showSiderNav ? 
            <Sider collapsible
              trigger={null}
              collapsed={this.state.collapsed}
              >
              <SiderNav/>
            </Sider> : null
          }          
          <Layout>
            <Header style={{background: '#fff', padding: '0 16px'}}>
                <HeaderBar collapsed={this.state.collapsed} onToggle={this.toggle}/>
            </Header>
            <Content>
              <ContentMain/>
            </Content>
            <Footer style={{textAlign: 'center'}}> </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapState = (state) => ({
  showSiderNav: state.getIn(['home', 'showSiderNav'])
})

export default connect(mapState, null)(Index)