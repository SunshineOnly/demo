/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import {Form, Input, DatePicker, Col,Radio} from 'antd';
import { Select } from 'antd';
import { Button ,Row} from 'antd';
import $ from 'jquery-ajax';
import _ from 'lodash';
import moment from 'moment';
import '../../public/css/product_info.css';
import  myObject from '../myObject';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let uuid = 1,keyss=[];

export class ProductPublishForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options:[],
            keys:props.keys,
            content:this.props.initDatas.content,
            initDatas: {
            productName:"",
                productPriority:"",
                projectName:"",
                projectPriority:"",
                status:"",
                updateTime:moment(),
                updateInfo:"",
                version:"",
        }
        }
    }

    remove(k) {
        const {form} = this.props;
        // can use data-binding to get
        let keys = this.state.keys.filter((key) => {
            return key !== k;
        });
        this.setState({
            keys:keys
        })
        // can use data-binding to set
        form.setFieldsValue({
            keys,
        });
    }

    add() {
        uuid++;
        const {form} = this.props;
        // can use data-binding to get
        let keys = this.state.keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        this.setState({
            keys:keys
        })
        form.setFieldsValue({
            keys,
        });
        console.log(keys);
    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount() {
        var This = this;
        var clientWidth = document.documentElement.clientWidth * 0.92;

        This.state.width = clientWidth;
        $.ajax({
            type: 'POST',
            url: '/products',
            async: false,
            success: function (resp) {
                console.log(resp);
                This.setState({
                    productArr: resp
                })
            }
        });
        myObject.initProductModal.add(This.setKeys.bind(this))
        myObject.initProductPriorityModa2.add(This.setIsProps.bind(This))
    }

    handleChange(value) {
        var self=this;
        let options;
        $.ajax({
            type: 'POST',
            url: '/getProductNames',
            async: false,
            success: function (resp) {
                console.log(resp);
                if(resp.productNames){
                    options = resp.productNames.map((name) => {
                        return <Option key={name}>{name}</Option>;
                    });

                }else{
                    options = [];
                }
                self.setState({
                    options: options
                })
            }
        });

    }
    setKeys(data){
        this.setState({
            keys:data,
        });
    }
    setIsProps(data){
        if(data.action=="add"){

            this.props.form.setFieldsValue({
                productName:"",
                projectName:"",
                status:"",
                updateTime:moment(),
                updateInfo:"",
                version:"",
                updateInfo1:[]
            })
        }else{
            this.setState({
                content:data.data.content,
            });

            this.props.form.resetFields();
        }

    }
    render() {
        var self=this;
        const FormItem = Form.Item;
        const {getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        uuid=this.state.keys[this.state.keys.length-1];
        const formItems = this.state.keys.map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`版本内容：`} key={k}>
                    {getFieldDecorator(`updateInfo${k}`, {
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "Your good friend's name",
                        }],
                        initialValue:self.props.initDatas.content[k-1]
                    })(
                        <Input style={{width: '60%', marginRight: 8}}/>
                    )}
                    <Button onClick={() => this.remove(k)}>remove</Button>
                </Form.Item>
            );
        });
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

                                <Select combobox
                                style={{ width: 200 }}
                                onChange={this.handleChange.bind(this)}
                                filterOption={false}
                                disabled={self.props.initDatas.productName!=""?true:false}
                                >
                            {this.state.options}
                                </Select>
                            )}

                        </FormItem>
                        {/*<FormItem
                            label="产品优先级"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 5}}
                        >
                            {getFieldDecorator("productPriority",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '请填写产品优先级?',
                                    }
                                ],
                                initialValue:self.props.initDatas.productPriority
                            })(

                                <Input disabled={self.props.initDatas.productPriority!=""?true:false}/>
                            )}

                        </FormItem>*/}
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
                            <Input disabled={self.props.initDatas.projectName!=""?true:false}/>
                        )}

                        </FormItem>
                        {/*<FormItem
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

                                <Input disabled={self.props.initDatas.projectPriority!=""?true:false}/>
                            )}

                        </FormItem>*/}
                        <FormItem
                            label="版本状态"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 19}}
                        >
                            {getFieldDecorator("status",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'number',
                                        message: '请选择状态?',
                                    }
                                ],
                                initialValue:self.props.initDatas.status,
                            })(
                                <RadioGroup>
                                    <RadioButton value={1}>已发布</RadioButton>
                                    <RadioButton value={2}>开发中</RadioButton>
                                    <RadioButton value={0}>历史版本</RadioButton>
                                </RadioGroup>
                            )}

                        </FormItem>
                        <FormItem
                            label="发布时间"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 19}}
                        >
                            {getFieldDecorator("updateTime",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'object',
                                        message: '何时发布?',
                                    }
                                ],
                                initialValue:moment(self.props.initDatas.updateTime),
                            })(
                                <DatePicker />
                            )}

                        </FormItem>
                        <FormItem
                            label="版本号"
                            labelCol={{span: 5}}
                            wrapperCol={{span: 5}}
                        >
                            {getFieldDecorator("version",{
                                rules: [
                                    {
                                        required: true,
                                        type: 'string',
                                        message: '请填写版本号?',
                                    }
                                ],
                                initialValue:self.props.initDatas.version
                            })(
                                <Input />
                            )}

                        </FormItem>

                        {formItems}

                        <FormItem wrapperCol={{span: 16, offset: 8}} style={{marginTop: 24}}>
                            <Button onClick={this.add.bind(this)} style={{marginRight: 8}}>添加版本说明</Button>
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
            values["updateTime"]=values["updateTime"].format('YYYY-MM-DD');
            let content="";
            _.map(_.keys(values),function(k,i){
                if(k.indexOf("updateInfo")>-1){
                    content=`${content}${values[k]}\/\/`;
                }
            });
           values["updateInfo"]=content;
           values.id=self.props.initDatas.id;
                if (err) {
                    return;
                } else {
                    if(values.id){
                       $.ajax({
                         type: 'POST',
                         url: '/updateProjetPublish',
                         data: values,
                         async: false,
                         success: function (resp) {
                         console.log(resp);
                         myObject.ajaxSubmit.dispatch("success")
                         }
                         })
                    }else{
                        $.ajax({
                         type: 'POST',
                         url: '/publish/products',
                         data: values,
                         async: false,
                         success: function (resp) {
                         console.log(resp);
                         myObject.ajaxSubmit.dispatch("success")
                         }
                         })
                    }

                    console.log(values)
                }
            }
        )
    }
}
ProductPublishForm = Form.create({})(ProductPublishForm)
