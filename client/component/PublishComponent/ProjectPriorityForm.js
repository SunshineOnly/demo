/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import {Form, Input, Col} from 'antd';
import { Button ,Row} from 'antd';
import $ from 'jquery-ajax';
import  myObject from '../../myObject';



export class ProjectPriorityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectsDatas: {
            productName:"",
            projectName:"",
            projectPriority:"",
        }
        }
    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount() {
        var This = this;
        var clientWidth = document.documentElement.clientWidth * 0.92;

        This.state.width = clientWidth;

    }


    render() {
        var self=this;
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;
        return (
            <Row style={{minWidth: "500px", paddingTop: "24px"}}>
                <Col xs={24} sm={24} md={24} lg={24}  style={{margin: "0 auto"}}>
                    <Form horizontal>
                        <FormItem
                            label="产品名"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 5}}
                        >
                            {getFieldDecorator("productName",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '请填写产品名?',
                                    }
                                ],
                                initialValue:self.props.initDatas.productName
                            })(
                                    <Input disabled/>
                            )}

                        </FormItem>
                        <FormItem
                            label="项目名"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 5}}
                        >
                            {getFieldDecorator("projectName",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '请填写项目名?',
                                    }
                                ],
                                initialValue:self.props.initDatas.projectName
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            label="项目优先级"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 5}}
                        >
                            {getFieldDecorator("projectPriority",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '请填写项目优先级?',
                                    }
                                ],
                                initialValue:self.props.initDatas.projectPriority
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem wrapperCol={{span: 16, offset: 8}} style={{marginTop: 24}}>

                            <Button type="primary" onClick={this.handleSubmit.bind(this)} style={{display:"none"}} className="publishSubmit">发布</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>

        )
    }

    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        self.props.form.validateFields((err, values) => {
           values.id=self.props.initDatas.id;
            values.productPriority=values.productPriority*1;
                if (err) {
                    return;
                } else {
                       $.ajax({
                         type: 'POST',
                         url: '/projetPublish/updateProductPrioirty',
                         data: values,
                         async: false,
                         success: function (resp) {
                         console.log(resp);
                             if(resp.code==1){
                                 myObject.priorityCloseModal.dispatch("success")
                             }

                         }
                         })


                    console.log(values)
                }
            }
        )
    }
}
ProjectPriorityForm = Form.create({})(ProjectPriorityForm)
