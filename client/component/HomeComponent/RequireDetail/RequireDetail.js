/**
 * 子任务处理流程
 *  1.打开弹框时 先根据require表中 subtask id字符串 获取子任务详细 数组 并设置每条 isOriginal(是否原始记录) 为 true -----MianTable.js
 *  2.将子任务数组设置为 state ，循环生成 FormItem
 *  3.提交时获取 根据子任务数组是否有id 判断是否为新增， 然后获取子任务表 最后一项的id 并为新子任务添加新id
 */

import React from 'react';
import {Row,Col,Collapse,Popconfirm,notification,Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Cascader, DatePicker, Slider, Select, Upload,message} from 'antd';
import $ from 'jquery-ajax';
import _ from 'lodash'
import moment from 'moment';
import myObject from '../../../myObject';
const FormItem = Form.Item;



export class RequireDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading:false
        };
    }

    handleReset() {
        this.props.form.resetFields();
    }


    /**
     * 编辑成功后提示
     */
    openNotification () {
        notification.open({
            message: '操作成功！',
            description: '恭喜您，更新需求成功！',
            icon: <Icon type="smile-circle" style={{ color: '#2db7f5' }} />,
        });
    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount(){
        //对话框切换至编辑时  设置上传文件列表
        this.handleFileList(this.props.detail.fileInfo)
    }

    /**
     * 设置上传文件列表
     * @param fileInfo
     */
    handleFileList(fileInfo){
        var newFileList = [];
        if(fileInfo && fileInfo.length>0){
            fileInfo.map((o,index)=>{
                var newPath = _.clone(o.path)
                newPath = newPath.substr(6);
                newFileList[index] = {};
                newFileList[index].uid = o.id;
                newFileList[index].name = o.originalfilename;
                newFileList[index].status = 'done';
                newFileList[index].thumbUrl = newPath;
                newFileList[index].type = o.type;
                newFileList[index].response = {};
                newFileList[index].response.files = {};
                newFileList[index].response.files.file = [];
                newFileList[index].response.files.file[0] = {};
                newFileList[index].response.files.file[0].id = o.id;
                newFileList[index].response.files.file[0].originalFilename = o.originalfilename;
                newFileList[index].response.files.file[0].path = o.path;
                newFileList[index].response.files.file[0].size = o.size;

            });
            this.props.form.setFieldsValue({
                upload : newFileList
            })
        }

    }

    successMessage(text) {
        message.success(text);
    }

    errorMessage (text) {
        message.error(text);
    }

    warningMessage (text) {
        message.warning(text);
    }
    /**
     * 处理文件上传
     * @param values
     * @param callBack
     */
    handleFileUpLoad(values,callBack){
        $.ajax({
            url:'/getFileLastId',
            type:'GET',
            success:function(result){
                values.filesArr = [];
                var newId = result[0].id + 1;
                //如果改文件无id说明为 新上传文件 计数+1
                var count = 0;
                //将组件upload数据存入filesArr
                if(values.upload){
                    values.upload.map((o,index)=>{
                        values.filesArr[index] = {};
                        //如果上传文件id存在  就用当前文件id
                        if(o.response.files.file[0].id){
                            values.filesArr[index].id = o.response.files.file[0].id;
                        }else{
                            values.filesArr[index].id = newId + count;
                            count++;
                        }
                        values.filesArr[index].type = o.type;
                        values.filesArr[index].originalfilename = o.response.files.file[0].originalFilename;
                        values.filesArr[index].path = o.response.files.file[0].path;
                        values.filesArr[index].size = o.response.files.file[0].size;
                    })
                }else{
                    values.filesArr = [];
                }
                console.log(values.filesArr)
                callBack.call(this)
            }
        })
    }

    /**
     * 需求用例保存事件
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        var This = this;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return;
            }
            This.setState({
                iconLoading:true
            })
            values.requireid = this.props.clickedRow.id;
            This.handleFileUpLoad(values,function(){
                console.log(values)
                //values.upload = '';
                values.upload=values.filesArr;
                values.fileInfo = values.filesArr;
                if(This.props.detail.id){
                    //id存在 更新
                    values.id = This.props.detail.id;
                    $.ajax({
                        url:'/updaterequiredetail',
                        type:'POST',
                        contentType: "application/json",
                        data:JSON.stringify(values),
                        success:function(result){
                            if(result=='fail'){
                                This.errorMessage('保存失败，请重试！')
                            }else if(result=='success'){
                                This.successMessage('保存成功！')
                            }
                            myObject.DetailsSaved.dispatch(values)
                            myObject.CollapseToShrink.dispatch() //保存后收缩折叠面板
                            This.setState({
                                iconLoading:false
                            })
                        }
                    })
                }else{
                    //id不存在 插入
                    $.ajax({
                        url:'/saverequiredetail',
                        type:'POST',
                        contentType: "application/json",
                        data:JSON.stringify(values),
                        success:function(result){
                            if(result=='fail'){
                                This.errorMessage('保存失败，请重试！')
                            }else if(result=='success'){
                                This.successMessage('保存成功！')
                            }
                           // myObject.DetailsSaved.dispatch(values)
                            myObject.CollapseToShrink.dispatch() //保存后收缩折叠面板
                            This.setState({
                                iconLoading:false
                            })
                        }
                    })
                }
            })
        })

    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const props = {
            name: 'file',
            action: '/fileuploading?id='+this.props.clickedRow.id,
            listType: 'picture',
            data:{id:this.props.clickedRow.id},
            headers: {
                authorization: 'authorization-text',
            },
            beforeUpload(file) {
                const isJPG = file.type.substr(0, 5) == 'image';
                if (!isJPG) {
                    message.error('只能上传图片文件');
                }
                return isJPG;
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功.`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        const {getFieldDecorator, getFieldError, isFieldValidating,getFieldValue} = this.props.form;
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
                <FormItem
                    {...formItemLayout2}
                    label="用例名称"
                    help={isFieldValidating('casename') ? '验证中...' : (getFieldError('casename') || []).join(', ')}
                >
                    {getFieldDecorator('casename', {
                        initialValue: this.props.detail.casename?this.props.detail.casename:'',
                        rules: [
                            {required: true, message: '用例名称不能为空'},
                        ],
                    })(
                        <Input id="casename" name="casename" type="text" placeholder="请输入姓名..."/>
                    )}
                </FormItem>
                {/*责任人*/}
                <FormItem
                    {...formItemLayout2}
                    label="涉及模块"
                    help={isFieldValidating('involvemodule') ? '验证中...' : (getFieldError('involvemodule') || []).join(', ')}
                >
                    {getFieldDecorator('involvemodule', {
                        initialValue: this.props.detail.involvemodule?this.props.detail.involvemodule:'',
                    })(
                        <Input id="involvemodule" name="involvemodule" type="text" placeholder="请输入涉及模块..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="涉及用户"
                    help={isFieldValidating('involveuser') ? '验证中...' : (getFieldError('involveuser') || []).join(', ')}
                >
                    {getFieldDecorator('involveuser', {
                        initialValue: this.props.detail.involveuser?this.props.detail.involveuser:'',
                    })(
                        <Input id="involveuser" name="involveuser" type="text" placeholder="请输入涉及用户..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="场景描述"
                    help={isFieldValidating('scencedescription') ? '验证中...' : (getFieldError('scencedescription') || []).join(', ')}
                >
                    {getFieldDecorator('scencedescription', {
                        initialValue: this.props.detail.scencedescription?this.props.detail.scencedescription:'',
                    })(
                        <Input id="scencedescription" name="scencedescription" type="text" placeholder="请输入场景描述..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="前置条件"
                    help={isFieldValidating('precondition') ? '验证中...' : (getFieldError('precondition') || []).join(', ')}
                >
                    {getFieldDecorator('precondition', {
                        initialValue: this.props.detail.precondition?this.props.detail.precondition:'',
                    })(
                        <Input id="precondition" name="precondition" type="text" placeholder="请输入前置条件..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="后置条件"
                    help={isFieldValidating('backcondition') ? '验证中...' : (getFieldError('backcondition') || []).join(', ')}
                >
                    {getFieldDecorator('backcondition', {
                        initialValue:  this.props.detail.backcondition?this.props.detail.backcondition:'',
                    })(
                        <Input id="backcondition" name="backcondition" type="text" placeholder="请输入后置条件..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="需求描述"
                    help={isFieldValidating('requiredescription') ? '验证中...' : (getFieldError('requiredescription') || []).join(', ')}
                >
                    {getFieldDecorator('requiredescription', {
                        initialValue:this.props.detail.requiredescription?this.props.detail.requiredescription:'',
                    })(
                        <Input id="requiredescription" name="requiredescription" type="textarea" rows={5} placeholder="请输入需求描述..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="验证标准"
                    help={isFieldValidating('acceptstandard') ? '验证中...' : (getFieldError('acceptstandard') || []).join(', ')}
                >
                    {getFieldDecorator('acceptstandard', {
                        initialValue: this.props.detail.acceptstandard?this.props.detail.acceptstandard:'',
                    })(
                        <Input id="acceptstandard" name="acceptstandard" type="textarea" rows={5} placeholder="请输入验证标准..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="约束规则"
                    help={isFieldValidating('constraintrule') ? '验证中...' : (getFieldError('constraintrule') || []).join(', ')}
                >
                    {getFieldDecorator('constraintrule', {
                        initialValue:  this.props.detail.constraintrule?this.props.detail.constraintrule:'',
                    })(
                        <Input id="constraintrule" name="constraintrule" type="textarea" rows={5} placeholder="请输入约束规则..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="备注说明"
                    help={isFieldValidating('remark') ? '验证中...' : (getFieldError('remark') || []).join(', ')}
                >
                    {getFieldDecorator('remark', {
                        initialValue:  this.props.detail.remark?this.props.detail.remark:'',
                    })(
                        <Input id="remark" name="remark" type="textarea" rows={5} placeholder="请输入备注说明..."/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="原型示例"
                    style={{marginTop: 50}}
                >
                    {getFieldDecorator('upload', {
                        valuePropName: 'fileList',
                        normalize: this.normFile,
                    })(
                        <Upload {...props} className="upload-list-inline">
                            <Button type="ghost">
                                <Icon type="upload"/> 点击上传图片
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem wrapperCol={{span: 16, offset: 3}} style={{marginTop: 50}}>
                    <Button loading={this.state.iconLoading} type="primary" icon="save" onClick={this.handleSubmit.bind(this)}>保存</Button>
                </FormItem>
            </Form>
        );
    }
}
RequireDetail = Form.create()(RequireDetail);