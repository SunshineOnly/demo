/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Row,Col,notification,Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Cascader, DatePicker, Slider, Select, Upload,message} from 'antd';
import $ from 'jquery-ajax';
import myObject from '../myObject';
const FormItem = Form.Item;
const Option = Select.Option;

export class NewRequireForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cascaderoptions:[],
            statusmenu:[],
            version:[]
        };
    }

    handleReset() {
        this.props.form.resetFields();
    }

    openNotification () {
        notification.open({
            message: '操作成功！',
            description: '恭喜您，新建需求成功！',
            icon: <Icon type="smile-circle" style={{ color: '#2db7f5' }} />,
        });
    }
    /**
     * 分类菜单循环方法
     */
    menuForeach(result){
        result.forEach(function (res) {
            res.value = res.id;
            res.label = res.projectname;
            if(res.subproject.length>0){
                res.children = res.subproject;
                this.menuForeach(res.children)
            }
        }.bind(this));
    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount(){
        var This = this;
        $.ajax({
            type: 'GET',
            url: '/projectmenu',
            success: function (result) {
                This.menuForeach(result)
                console.log(result);
                This.setState({
                    cascaderoptions:result
                })
            }
        });

        $.ajax({
            url: '/statusmenu',
            type: 'GET',
            success: function (result) {
                result.forEach(function (row) {
                    row.key = row.id.toString();
                });
                This.setState({
                    statusmenu: result
                })
            }
        });
        myObject.newRequireClose.add(this.handleReset.bind(this))
        myObject.addNewRequire.add(this.handleSubmit.bind(this))
    }

    /**
     * 项目分类列表改变时切换版本列表
     */
    handleProjectChange(value){
        var This = this;
        var length = value.length-1;
        var projectId = value[length];
        $.ajax({
            url: '/versionbyproject',
            type: 'POST',
            data:{project:projectId},
            success: function (result) {
                if(result.length>0){
                    This.setState({
                        version: result
                    });
                    This.props.form.setFieldsValue({prversion:result[length].id.toString()})
                }else{
                    This.setState({
                        version: []
                    });
                }
            }
        })
    }

    handleFileUpload(values,callBack){
        $.ajax({
            url: '/getFileLastId',
            type: 'GET',
            success: function (result) {
                console.log('最后的file id====' + result)
                values.filesArr = [];
                var newId = result[0].id + 1;
                //如果改文件无id说明为 新上传文件 计数+1
                var count = 0;
                //将upload数据存入filesArr
                if (values.upload) {
                    values.upload.map((o, index)=> {
                        values.filesArr[index] = {};
                        //如果上传文件id存在  就用当前文件id
                        if (o.response.files.file[0].id) {
                            values.filesArr[index].id = o.response.files.file[0].id;
                        } else {
                            values.filesArr[index].id = newId + count;
                            count++;
                        }
                        values.filesArr[index].type = o.type;
                        values.filesArr[index].originalfilename = o.response.files.file[0].originalFilename;
                        values.filesArr[index].path = o.response.files.file[0].path;
                        values.filesArr[index].size = o.response.files.file[0].size;
                    })
                }
                console.log(values)
                callBack.call(this)
            }
        });
    }

    handleSubmit(e) {
        var This = this;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                console.log(values);
                return;
            }
            if(values.classify){
                var length = values.classify.length;
                values.classify = values.classify[length - 1];
            }
            values.status = parseInt(values.status);
            this.handleFileUpload(values, function () {
                $.ajax({
                    url: '/addNewRequire',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(values),
                    success: function (result) {
                        if (result == 'success') {
                            {
                                This.openNotification()
                            }
                            //发送表格改变事件，为了indexTable组件更新表格 data数据
                            myObject.tableChange.dispatch()
                            //TODO:关闭对话框
                            This.props.handleCancel()
                        }
                    }
                });
            });
        });
    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    /**
     * 验证提出人是否存在
     * */
    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            $.ajax({
                url: "/queryname",
                type: 'POST',
                data: {nickname: value},
                success: function (response) {
                    if (response == 'success') {
                        callback();
                    } else {
                        callback([new Error('抱歉,此提出人不存在！')]);
                    }
                }
            });
        }
    }

    render() {
        const props = {
            name: 'file',
            action: '/fileuploading?id=0',
            data:{id:0},
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功.`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        const statusMenu = this.state.statusmenu;
        const versionList = this.state.version;
        const statusList = statusMenu.map(function (status) {
            return <Option key={status.key} value={status.key}>{status.statusname}</Option>
        });
        const versionElement = versionList.map(function (version,index) {
            return <Option key={index.toString()} value={version.id.toString()}>{version.version}</Option>
        });
        const {getFieldDecorator, getFieldError, isFieldValidating} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const formItemLayout2 = {
            labelCol: {span: 3},
            wrapperCol: {span: 19},
        };
        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <Row>
                    <Col span={12}>
                        {/*提出人*/}
                        <FormItem
                            {...formItemLayout}
                            label="提出人"
                            hasFeedback
                            help={isFieldValidating('introducer') ? '验证中...' : (getFieldError('introducer') || []).join(', ')}
                        >
                            {getFieldDecorator('introducer', {
                                rules: [
                                    {required: true, message: '提出人不能为空'}
                                ],
                                validateTrigger:'onBlur'
                            })(
                                <Input id="introducer" name="introducer" type="text" placeholder="请输入姓名..."/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {/*产品分类*/}
                        <FormItem
                            {...formItemLayout}
                            label="分类"
                            help={isFieldValidating('classify') ? '验证中...' : (getFieldError('classify') || []).join(', ')}
                        >
                            {getFieldDecorator('classify')(
                                <Cascader showSearch options={this.state.cascaderoptions} expandTrigger="hover"
                                          placeholder="请选择分类..."
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {/*主题*/}
                <FormItem
                    {...formItemLayout2}
                    label="主题"
                    hasFeedback
                    help={isFieldValidating('title') ? '验证中...' : (getFieldError('title') || []).join(', ')}
                >
                    {getFieldDecorator('title', {
                        rules: [
                            {required: true, message: '主题不能为空'}
                        ],
                        validateTrigger:'onBlur'
                    })(
                        <Input id="title" name="title" type="text" placeholder="请输入主题..."/>
                    )}
                </FormItem>
                {/*所在状态*/}
                <FormItem
                    {...formItemLayout2}
                    label="状态"
                >
                    {getFieldDecorator('status', {initialValue: '1'})(
                        <Select showSearch id="status" placeholder="请选择状态..." style={{width: 200}} disabled>
                            {statusList}
                        </Select>
                    )}
                </FormItem>
                {/*提出人*/}
                {/*<FormItem
                 {...formItemLayout}
                 label="责任人"
                 hasFeedback
                 help={isFieldValidating('introducer') ? '验证中...' : (getFieldError('chargeperson') || []).join(', ')}
                 >
                 {getFieldDecorator('chargeperson', {
                 rules: [
                 {required: true, message: '责任人不能为空'},
                 {validator: this.userExists},
                 ],
                 validateTrigger:'onBlur'
                 })(
                 <Input id="chargeperson" name="chargeperson" type="text" placeholder="请输入姓名..."/>
                 )}
                 </FormItem>*/}




                {/*<FormItem
                    {...formItemLayout}
                    label="预计实现时间"
                >
                    {getFieldDecorator('prtime',{
                        rules: [
                            {
                                required: true,
                                type: 'object',
                                message: '请选择预计实现时间...',
                            }
                        ]
                    })(
                        <DatePicker size="default"/>
                    )}
                </FormItem>*/}
                {/*预计实现版本*/}
                {/*<FormItem
                    {...formItemLayout}
                    label="预计实现版本"
                >
                    {getFieldDecorator('prversion', {
                        initialValue: '',
                        rules:[{ required: true,message:'请选择预计实现版本...'}]
                    })(
                        <Select onChange={this.props.form.resetFields([{names:['prversion']}])} placeholder='请选择版本...' notFoundContent="请选择所在项目..." id="select2" style={{width: 200}}>
                            {versionElement}
                        </Select>
                    )}
                </FormItem>*/}
                {/*<FormItem
                    {...formItemLayout}
                    label="优先级"
                >
                    {getFieldDecorator('priority', {
                        rules: [
                            { required: true, message: '请选择优先级...' },
                        ]
                    })(
                        <RadioGroup>
                            <RadioButton value="1">普通</RadioButton>
                            <RadioButton value="2">高</RadioButton>
                            <RadioButton value="3">紧急</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>*/}
                {/*<FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 10}}
                    label="整理进度"
                >
                    {getFieldDecorator('process')(
                        <Slider marks={{0: '0%', 20: '20%', 40: '40%', 60: '60%', 80: '80%', 100: '100%'}}/>
                    )}
                </FormItem>*/}
                <FormItem
                    {...formItemLayout2}
                    label="描述"
                    style={{marginTop: '35px'}}
                >
                    {getFieldDecorator('description',{
                        rules: [
                            {required: true, message: '描述不能为空'}
                        ],
                        validateTrigger:'onBlur'
                    })(
                        <Input id="description" name="desc" type="textarea" rows={8} placeholder="请输入内容..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="上传附件"
                >
                    {getFieldDecorator('upload', {
                        valuePropName: 'fileList',
                        normalize: this.normFile,
                    })(
                        <Upload {...props}>
                            <Button type="ghost">
                                <Icon type="upload"/> 点击上传文件
                            </Button>
                        </Upload>
                    )}
                </FormItem>
            </Form>
        );
    }
}
NewRequireForm = Form.create()(NewRequireForm);