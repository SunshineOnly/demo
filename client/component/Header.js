/**
 * Created by Administrator on 2016/10/20.
 * 公用头部组件
 */
import React from 'react';
import {Row, Col, Input, Icon} from 'antd';
import $ from 'jquery-ajax';
import {IndexLink} from 'react-router'
import {LoginButton} from './HeaderComponent/LoginButton';
import {AddButton} from './HeaderComponent/AddButton';
import myObject from '../myObject';

export class Header extends React.Component {
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
            return <AddButton user={this.state.user} />
        } else {
            return (<div><LoginButton onUserSession={this.onUserSession.bind(this)}/><AddButton user={this.state.user} /></div>)
        }
    }

    render() {
        return (
            <header id="header" className="clearfix">
                <Row id="topNav">
                    <Col xs={24} sm={7} md={4} lg={3}>
                        <div className="h80 lh80 fonC1 f16">
                            <IndexLink className="fonC1 f16 undNone" to="/">Xrender&nbsp;·&nbsp;需求管理平台</IndexLink>
                        </div>
                    </Col>
                    <Col xs={0} sm={17} md={20} lg={21}>
                        <div id="searchBox">
                            <Input placeholder="搜索需求..." style={{border: 'none', marginTop: '-5px'}}/>
                        </div>
                        <div className="pull-right h80">
                            {this.chooseShow()}
                        </div>
                    </Col>
                </Row>
            </header>
        )
    }
}