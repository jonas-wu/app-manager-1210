import React from 'react'
import CustomBreadcrumb from '../../component/CustomBreadcrumb/index'
import TypingCard from '../../component/TypingCard'

export default class About extends React.Component{
  render(){
    return (
      <div>
        <CustomBreadcrumb arr={['关于']}/>
        <TypingCard source={'摩羯系统是神州优车集团下的APP发布平台...'} title='关于' />
      </div>
    )
  }
}