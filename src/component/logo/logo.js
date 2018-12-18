import React from 'react'
import './logo.css'

class Logo extends React.Component{
    render(){
        return (
            <div className="logo-container">
                <img className="logo-img" src={require('../../statics/loginlogo.png') } alt=""/>
            </div>
        )
    }
}

export default Logo