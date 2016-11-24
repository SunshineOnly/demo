/**
 * Created by Administrator on 2016/11/18.
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
export class IndexHeader extends React.Component{
    render(){
        return (
            <header className="header-wrapper">
                <div className="header" style={{marginTop: '50px'}}>
                    <QueueAnim delay={300} animConfig={[
                        { opacity: [1, 0], translateY: [0, -50] },
                        { opacity: [1, 0], translateY: [0, 50] }
                    ]} className="queue-simple">
                        <div key="a" className="header-logo"><img height="24"
                        src="/img/logo.png" /><span style={{fontSize: '16px',
                            fontWeight: 'lighter',
                            lineHeight: '24px',
                            verticalAlign: 'middle',paddingLeft:'15px',color:'#fff'}}>Xrender System</span>
                        </div>
                        <nav key="b" className="header-nav">
                            <ul>
                                <li><Link to="/main" activeStyle={{textDecoration: 'none'}}>需求管理平台</Link></li>
                                <li><Link to="/index" activeStyle={{textDecoration: 'none'}}>版本管理平台</Link></li>
                            </ul>
                        </nav>
                    </QueueAnim>
                    <div id="banner" className="banner-wrapper">
                        <div className="banner">
                            <div className="banner-demo"></div>
                            <div className="banner-text">
                                <QueueAnim delay={300} animConfig={[
                                    { opacity: [1, 0], translateY: [0, 50] },
                                    { opacity: [1, 0], translateY: [0, -50] }
                                ]} className="queue-simple">
                                    <h1 key="a" className="" style={{padding: '15px 0'}}>
                                        Vision System
                                    </h1>
                                    <h3 key="b" className="" style={{padding: '10px 0'}}>
                                        渲云管理平台
                                    </h3>
                                    <p key="c" className="" style={{padding: '5px 0'}} >
                                        渲云管理系统是一款用于企业的项目管理系统以需求管理为核心<br />拥有移动办公，项目管理，移动CRM，企业间协同等多项应用功能
                                       </p>
                                    <div key="d">
                                        <Link to="/main"  className="banner-text-button">立即进入</Link>
                                    </div>
                                </QueueAnim>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}