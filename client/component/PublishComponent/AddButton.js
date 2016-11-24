/**
 * Created by admin on 2016/10/22.
 */
import React from 'react';
import {Icon, Button, Menu, Dropdown, Popover, Modal} from 'antd';
import $ from 'jquery-ajax';
import myObject from '../../myObject';

export class AddButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false
        };
    }

    showModal() {
        this.setState({
            modalShow: true,
        });
    }

    handleOk() {
        myObject.addNewRequire.dispatch();
    }

    handleCancel(e) {
        console.log(e);
        this.setState({
            modalShow: false,
        },function(){
            myObject.newRequireClose.dispatch()
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
                }
            }
        })
    }


    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <p onClick={this.handleLogOut.bind(this)}>注销</p>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" disabled>3d menu item</Menu.Item>
            </Menu>
        );
        const userPart = function (user) {
            if (user) {
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <p className="pull-left h80 lh80 curp">
                            <span className="mr5">{this.props.user.nickname}<Icon type="caret-down"
                                                                                  className="ml5 caret-down-scale"/></span>
                            <img src="/img/header1.jpg" alt="" width="30" height="30"
                                 style={{verticalAlign: 'middle', borderRadius: '50%'}}/>
                        </p>
                    </Dropdown>
                )
            }
        }.bind(this);
        return (
            <div className="pull-right h80 mr15">
                <p className="pull-left h80 lh80 mr15">
                    <Button style={{float: 'right', marginTop: '27px'}} type="primary" icon="plus"
                            onClick={this.showModal.bind(this)}>新增需求</Button>
                </p>
                <Modal title="新增需求" visible={this.state.modalShow}
                       okText={<span><Icon type="save"/>&nbsp;&nbsp;提交</span>}
                       onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                       width={900} maskClosable={false}
                >
                    <NewRequireForm handleCancel={this.handleCancel.bind(this)}/>
                </Modal>
                {userPart(this.props.user)}
            </div>
        )
    }
}