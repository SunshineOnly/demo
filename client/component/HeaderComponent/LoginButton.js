/**
 * Created by Administrator on 2016/10/21.
 */
/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Icon, Button, Modal} from 'antd';
import {LoginForm} from './LoginForm';

export class LoginButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'Content of the modal dialog',
            visible: false,
        };
    }

    onChildChanged(newVisible){
        this.setState({
            visible:newVisible
        })
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk() {
        this.setState({
            ModalText: 'The modal dialog will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel() {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <p className="pull-right h80 lh80 ">
                <Button type="dashed" onClick={this.showModal.bind(this)}><Icon type="user" className="f16"/>登录</Button>
                <Modal title="Login"
                       visible={this.state.visible}
                       onOk={this.handleOk.bind(this)}
                       okText='登录'
                       maskClosable={false}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel.bind(this)}
                       footer=""
                >
                    <LoginForm onUserSession={this.props.onUserSession.bind(this)} visible={this.state.visible} callbackParent={this.onChildChanged.bind(this)}/>
                </Modal>
            </p>
        )
    }
}