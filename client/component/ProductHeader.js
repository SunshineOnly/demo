/**
 * Created by Administrator on 2016/10/20.
 * 公用头部组件
 */
import React from 'react';
import {Row, Col,  Button,Dropdown,Menu,Icon} from 'antd';
import $ from 'jquery-ajax';
import {Link} from 'react-router'
import {LoginButton} from './HeaderComponent/LoginButton';
import myObject from '../myObject';
import {browserHistory} from 'react-router'
export class ProductHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        };
    }
    //TODO:用于子组件更改父组件state
    onUserSession(newUserState) {
        this.setState({
            user: newUserState
        });
    }
    handleLogOut() {
        $.ajax({
            url: "/logout",
            type: 'POST',
            success: function (result) {
                if (result == 'success') {
                    //TODO:发送 事件 让父组件改变state
                    myObject.UserLogout.dispatch()
                    browserHistory.push("/index")
                }
            }
        })
    }
    //TODO:生成组件时 判断session中是否有user
    componentWillMount() {
        var This = this;
        $.ajax({
            url: '/session',
            type: 'GET',
            success: function (response) {
                if(response!='fail'){
                    This.setState({
                        user: response
                    });
                }else{
                    return false;
                }
            }
        })
        myObject.UserLogout.add(this.ChangeUserToNUll.bind(this))
    }

    ChangeUserToNUll(){
        this.setState({
            user:''
        },function(){
            myObject.sessionUser.dispatch(this.state.user)
        })
    }

    //TODO:session中存在user信息时显示 用户头像和添加按钮
    chooseShow() {
        if (this.state.user) {
            return (<div style={{lineHeight:"80px",float:"left",marginRight:"10px"}}><Button type="primary" onClick={this.intoIndex.bind(this)}>版本管理</Button></div>)
        } else {
            return (<div><LoginButton onUserSession={this.onUserSession.bind(this)}/></div>)
        }

    }
    intoIndex(){
        browserHistory.push("/publish/index")
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <p onClick={this.handleLogOut.bind(this)}>注销</p>
                </Menu.Item>
                <Menu.Divider />
            </Menu>
        );
        const userPart = function (user) {
            if (user) {
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <p className="pull-left h80 lh80 curp">
                            <span className="mr5">{this.state.user.nickname}<Icon type="caret-down"
                                                                                  className="ml5 caret-down-scale"/></span>
                            <img src="/img/header1.jpg" alt="" width="30" height="30"
                                 style={{verticalAlign: 'middle', borderRadius: '50%'}}/>
                        </p>
                    </Dropdown>
                )
            }
        }.bind(this);
        return (
            <header id="header" className="clearfix">
                <Row id="topNav">
                    <Col xs={24} sm={7} md={4} lg={3}>
                        <div className="h80 lh80 fonC1 f16">
                            <span className="fonC1 f16 undNone" >Xrender&nbsp;·&nbsp;版本发布平台</span>
                        </div>
                    </Col>
                    <Col xs={0} sm={17} md={20} lg={21}>

                        <div className="pull-right h80">
                            {this.chooseShow()}
                            {userPart(this.state.user)}
                        </div>
                    </Col>
                </Row>
            </header>
        )
    }
}