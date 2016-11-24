import React from 'react';
import {Row, Col, Button, Form, Icon, Input,message} from 'antd';
import $ from 'jquery-ajax';
import myObject from '../../myObject';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}
export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
        };
    }
    componentDidMount() {
        this.props.form.setFieldsValue({
            eat: true,
            sleep: true,
            beat: true,
        });
    }

    userExists(rule, value, callback) {
        var form = {
            account: value
        };
        if (!value) {
            callback();
        } else {
            $.ajax({
                url: '/loginUpAccount',
                type: 'POST',
                data: form,
                success: function (response) {
                    if (response == 'success') {
                        callback()
                    } else {
                        callback([new Error('抱歉，用户名不存在!')]);
                    }
                }
            });
        }
    }

    //TODO:处理表单重置

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }

    //TODO:登陆表单提交

    handleSubmit(e) {
        e.preventDefault();
        var This = this;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            $.ajax({
                url: '/loginUp',
                type: 'POST',
                data: values,
                success: function (response) {
                    if (response == 'success') {
                        //TODO:成功后设置 父组件模态框 可见为 false
                        var newVisible = false;
                        This.setState({
                            visible: newVisible
                        });
                        This.props.callbackParent(newVisible);
                        message.success('登录成功');
                        //TODO:登陆成功后获取session中的user信息
                        $.ajax({
                            url: '/session',
                            type: 'GET',
                            success:function(response){
                                This.props.onUserSession(response) //改变父组件 state 来切换 显示登录按钮和用户信息头像
                                myObject.sessionUser.dispatch(response) //用户登录发送 response
                            }
                        })
                    } else {
                        message.error('密码错误请重新输入！');
                    }
                }
            });
            console.log(values);
        });
    }

    render() {
        const {getFieldDecorator, getFieldError, isFieldValidating} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Form horizontal>
                <Row>
                    <Col span={24} style={{marginBottom: '25px'}}><h1 style={{textAlign: 'center', fontSize: '24px'}}>
                        Xrender</h1></Col>
                </Row>
                <FormItem
                    {...formItemLayout}
                    label={<span className="f14"><Icon type="user"/>&nbsp;&nbsp;用户名</span>}
                    hasFeedback
                    help={isFieldValidating('account') ? 'validating...' : (getFieldError('account') || []).join(', ')}
                >
                    {getFieldDecorator('account', {
                        rules: [
                            {required: true,message:'请输入用户名...'},
                            {validator: this.userExists},
                        ],
                        validateTrigger:'onBlur'
                    })(
                        <Input placeholder="请输入用户名..."/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={<span className="f14"><Icon type="lock"/>&nbsp;&nbsp;密码</span>}
                >
                    {getFieldDecorator('password', {
                    })(
                        <Input placeholder="请输入密码..." type="password" autoComplete="off"
                               onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                        />
                    )}
                </FormItem>

                <FormItem
                 wrapperCol={{ span: 12, offset: 9 }}
                 >
                 <Button type="primary" onClick={this.handleSubmit.bind(this)}>登录</Button>
                 &nbsp;&nbsp;&nbsp;
                 <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                 </FormItem>
            </Form>
        );
    }
}

LoginForm = createForm()(LoginForm);