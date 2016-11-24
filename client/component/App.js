/**
 * Created by Administrator on 2016/10/13.
 */
import React from 'react';
import {Header} from './Header';
import $ from 'jquery-ajax';
import myObject from '../myObject';
import {Home} from './Home';
export class App extends React.Component {
    //TODO:获取session 将session存在 localStorage中
    componentWillMount() {
        var This = this;
        $.ajax({
            url: '/session',
            type: 'GET',
            success: function (response) {
                if (response != 'fail') {
                    sessionStorage.setItem("user", JSON.stringify(response))
                }
            }
        });
        myObject.sessionUser.add(this.handlePrivilegeChange.bind(this)) //监听 sessionUser事件 (LoginForm 组件登录发送)
    }

    //更根据用户全是设置 state
    handlePrivilegeChange(response) {
        if (response != 'fail') {
            sessionStorage.setItem("user", JSON.stringify(response))
            myObject.sessionStorageChange.dispatch()
        }
    }

    render() {
        return (
            <div id="mainBox">
                <Header />
                {this.props.children}
            </div>
        )
    }
}