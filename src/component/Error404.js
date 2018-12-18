import React from 'react'
import { Link } from 'react-router-dom'
import { SERVER } from '../utils/constants'
function Error404() {
  return (
    <div style={{textAlign: 'center', padding: '25vh'}}>
      <div style={{fontSize: '48px', lineHeight: '50px', marginBottom: '50px'}}>
        o(╥﹏╥)o
      </div>
      <div style={{fontSize: '44px', lineHeight: '60px'}}>
        404
      </div>
      <div style={{fontSize: '26px', lineHeight: '62px', fontWeight: '700'}}>
        找不到页面了
      </div>
      <div style={{fontSize: '20px', lineHeight: '40px'}}>
        <Link to={SERVER+"/"}>返回首页</Link>
      </div>
    </div>
  )  
}

export default Error404