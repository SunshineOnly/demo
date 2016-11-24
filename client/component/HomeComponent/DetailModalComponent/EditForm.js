/**
 * 子任务处理流程
 *  1.打开弹框时 先根据require表中 subtask id字符串 获取子任务详细 数组 并设置每条 isOriginal(是否原始记录) 为 true -----MianTable.js
 *  2.将子任务数组设置为 state ，循环生成 FormItem
 *  3.提交时获取 根据子任务数组是否有id 判断是否为新增， 然后获取子任务表 最后一项的id 并为新子任务添加新id
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Row,Col,Alert,Collapse,Popconfirm,notification,Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Cascader, DatePicker, Slider, Select, Upload,message} from 'antd';
import $ from 'jquery-ajax';
import _ from 'lodash'
import moment from 'moment';
import myObject from '../../../myObject';
import {RequireDetail} from '../RequireDetail/RequireDetail';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const Panel = Collapse.Panel;
/**
 * 详细需求模式 数据模型
 */
function detailsModel (){
    this.id= null;
    this.casename= null;
    this.involvemodule= null;
    this.involveuser= null;
    this.scencedescription= null;
    this.precondition= null;
    this.backcondition= null;
    this.requiredescription= null;
    this.acceptstandard= null;
    this.constraintrule= null;
    this.remark= null;
    this.requireid= null;

}

export class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cascaderoptions:[],
            statusmenu:[],
            version:[],
            details:[],
            iconLoading: false,
            activeKey:''
        };
    }

    handleReset() {
        this.props.form.resetFields();
        this.setState({
            details:[]
        })
    }

    /**
     * 处理详细需求描述 删除
     * @param id 描述用例id
     * @param index 描述用例在state数组中的序列
     * @param e
     */
    handleDetailItemDel(id,index,e){
        e = e || window.event;
        e.stopPropagation();
        var This = this;
        if(id){
            //发送ajax 改变该描述state
            $.ajax({
                url:'/delrequireDetail',
                type:'POST',
                data:{id:id},
                success:function(result){
                    if(result=='success'){
                        var newdetails = This.state.details;
                        newdetails.splice(index, 1)
                        This.setState({
                            details:newdetails
                        })
                    }
                }
            })
        }else{
            var newdetails = this.state.details;
            newdetails.splice(index, 1)
            this.setState({
                details:newdetails
            })
        }
    }
    stopPropagation(e){
        e = e || window.event;
        e.stopPropagation();
    }

    /**
     * 收缩全部手风琴方法
     */
    handleCollapseToShrink(){
        this.setState({
            activeKey:''
        })
    }

    /**
     * 处理手风琴展开方法
     * @param key
     */
    handlePannelClick(key){
        key = key.toString()
        this.setState({
            activeKey: this.state.activeKey?this.state.activeKey!=key?key:'':key
        })
    }
    /**
     * 生成需求描述组件的子组件
     * @returns {Array}
     */
    handledetailsList(){
        if(this.state.details.length>0){
            return this.state.details.map((detail,index)=>{
                return (
                        <Panel header={
                            <p style={{paddingRight:'10px'}} onClick={this.handlePannelClick.bind(this,index)} >{detail.casename}
                                <Popconfirm placement="top" title='确定删除此用例？' onConfirm={this.handleDetailItemDel.bind(this,detail.id,index)} okText="确认" cancelText="取消">
                                    <Button
                                        onClick={this.stopPropagation.bind(this)}
                                        style={{marginTop: '8px'}}
                                        className='pull-right' size="small" type="ghost" shape="circle-outline" icon="minus" />
                                </Popconfirm>

                            </p>
                        }
                               key={index.toString()}>
                            <RequireDetail detail={detail?detail:[]} clickedRow={this.props.clickedRow}/>
                        </Panel>
                )
            })
        }
    }

    /**
     * 需求描述组件循环
     * @returns {XML}
     */
    detailsComponent(){
        if(this.state.details.length>0){
            return (
                <Collapse activeKey={this.state.activeKey} accordion style={{marginBottom:'20px'}} bordered={false}>
                    {this.handledetailsList()}
                </Collapse>
            )
        }
    }

    handleSetSubTask(){
        var subtask = this.props.clickedRow.subtaskdec;
        this.setState({
            subtask:subtask
        })
    }


    /**
     * 移除子任务方法
     * @param index
     */
    remove(index) {
        console.log(index)
        var newSubTask = [];
        newSubTask = this.state.subtask;
        newSubTask.splice(index,1)
        this.setState({
            subtask:newSubTask
        })
    }
    /**
     * 添加子任务方法
     * @param index
     */
    add() {
        var newsubtask = new Object();
        newsubtask.description = '';
        newsubtask.id = '';
        this.setState({
            subtask:_.concat(this.state.subtask,newsubtask)
        })

    }
    /**
     * 编辑成功后提示
     */
    openNotification () {
        notification.open({
            message: '操作成功！',
            description: '更新需求成功！',
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
     * 获取被点击行项目数组  [supprojectId,subprojectId]
     * params 项目列表[array] 点击行项目名[string]
     */
    getProjectArray(result,classify){
        var values = [];
        if(this.state.cascaderoptions.length>0){
            result.forEach(function(sup) {
                if(sup.projectname == classify){
                    values.push(sup.value)
                }else{
                    if(sup.children){
                        sup.children.forEach(function(sub){
                            if(sub.projectname == classify){
                                values.push(sup.value)
                                values.push(sub.value)
                            }
                        })
                    }
                }
            });
        }

        return values
    }
    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount(){
        var This = this;
        this.props.form.setFieldsValue({
            keys: [0],
        });
        $.ajax({
            type: 'GET',
            url: '/projectmenu',
            success: function (result) {
                This.menuForeach(result)
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

        //对话框显示时 根据当前项目ID更新版本列表
        myObject.modelShow.add(this.handleShowVersionList.bind(this));
        //对话框关闭 编辑表单重置
        myObject.modelColse.add(this.handleReset.bind(this));
        //对话框切换至详情 编辑表单重置
        myObject.modelToInfo.add(this.handleReset.bind(this));
        //对话框切换至编辑时  设置上传文件列表
        myObject.modelToEdit.add(this.handleFileList.bind(this));
        //需求用例 保存后收缩手风琴
        myObject.CollapseToShrink.add(this.handleCollapseToShrink.bind(this))
        //myObject.DetailsSaved.add(this.handleDetailsChange.bind(this))
    }

    /*handleDetailsChange(values){
        var This = this;
        var newState = _.clone(This.state.details);
        var index = _.findIndex(newState, {id: values.id});
        newState[index] = values;
        This.setState({
            iconLoading:false,
            details:newState
        })
    }*/


    /**
     * 设置上传文件列表与需求用例列表
     * @param fileInfo
     */
    handleFileList(fileInfo,detailsList){
        var newFileList = [];
        if(fileInfo && fileInfo.length>0){

            fileInfo.map((o,index)=>{
                newFileList[index] = {};
                newFileList[index].uid = o.id;
                newFileList[index].name = o.originalfilename;
                newFileList[index].status = 'done';
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
        /**
         * 设置详细需求列表
         */
        console.log(detailsList)
        this.setState({
            details:detailsList
        })
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
                    //展示最新版本
                    This.props.form.setFieldsValue({prversion:result[length].id.toString()})
                }else{
                    This.setState({
                        version: []
                    });
                }
            }
        })
    }
    /**
     * 对话框打开时 编辑展示当前项目的版本列表
     */
    handleShowVersionList(value,prversionId){
        var This = this;
        var projectId = value;
        $.ajax({
            url: '/versionbyproject',
            type: 'POST',
            data:{project:projectId},
            success: function (result) {
                if(result.length>0){
                    This.setState({
                        version: result
                    });
                    result.forEach(function(res){
                        if(res.id == prversionId){
                            This.props.form.setFieldsValue({prversion:res.id.toString()})
                        }
                    })
                }else{
                    This.setState({
                        version: []
                    });
                }
            }
        })
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
     * 处理表单提交事件
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
            this.setState({
                iconLoading: true //设置按钮loading
            });
            var length = values.classify.length;
            values.id = This.props.clickedRow.id;
            values.classify = values.classify[length - 1];
            values.priority = parseInt(values.priority);
            values.prversion = parseInt(values.prversion);
            values.status = parseInt(values.status);
            values.prtime = values.prtime._d;
            values.loginUserId = JSON.parse(sessionStorage.getItem("user")).id; //获取当前登录用户
            //如果 新增需求prop存在内容 就执行新增子需求 否则 更改需求
            if(this.props.addSubInfo){
                //TODO:新增子任务
                values.supid = this.props.addSubInfo;
                values.determine = this.props.clickedRow.determineid;
                this.handleFileUpLoad(values,function(){
                    $.ajax({
                        url:'/addrequire',
                        type:'POST',
                        contentType: "application/json",
                        data:JSON.stringify(values),
                        success:function(result){
                            if(result=='success'){
                                {This.openNotification()}
                                This.setState({
                                    iconLoading: false
                                });
                                //发送表格改变事件，为了indexTable组件更新表格 data数据
                                myObject.tableChange.dispatch();
                                //TODO:关闭对话框
                                This.props.handleCancel()
                            }
                        }
                    });
                })

            }else{
                //TODO:更改需求
                //获取file表中最后一个id
                this.handleFileUpLoad(values,function(){
                    $.ajax({
                        url:'/updaterequire',
                        type:'POST',
                        contentType: "application/json",
                        data:JSON.stringify(values),
                        success:function(result){
                            if(result=='success'){
                                {This.openNotification()}
                                //发送表格改变事件，为了indexTable组件更新表格 data数据
                                This.setState({
                                    iconLoading: false
                                });
                                myObject.tableChange.dispatch()
                                //TODO:关闭对话框
                                This.props.handleCancel()
                            }
                        }
                    });
                })
            }
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

    error() {
        message.error('请输入正确的标题!');
    };

    /**
     * 添加详细需求描述的确认回调
     * @returns {boolean}
     */
    confirm() {
        var detailsList = this.state.details;
        var title = ReactDOM.findDOMNode(this.refs.detailtitle).getElementsByTagName('input')[0].value;
        console.log(title)
        if(_.isEmpty(title)){
            this.error()
            return false
        }else{
            var newDetailList = new detailsModel();
            newDetailList.casename = title;
            detailsList.push(newDetailList);
            this.setState({
                details:detailsList
            },function(){
                ReactDOM.findDOMNode(this.refs.detailtitle).getElementsByTagName('input')[0].value = '';
            })
        }
    }

    render() {
        const props = {
            name: 'file',
            action: '/fileuploading?id='+this.props.clickedRow.id,
            data:{id:this.props.clickedRow.id},
            headers: {
                authorization: 'authorization-text',
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
        const statusMenu = this.state.statusmenu;
        const versionList = this.state.version;
        //状态列表循环
        const statusList = statusMenu.map(function (status) {
            return <Option key={status.key} value={status.key}>{status.statusname}</Option>
        });
        //版本列表循环
        const versionElement = versionList.map(function (version,index) {
            return <Option key={index.toString()} value={version.id.toString()}>{version.version}</Option>
        });
        const clickRowClassifyArray = this.getProjectArray(this.state.cascaderoptions, this.props.clickedRow.classify);
        const {getFieldDecorator, getFieldError, isFieldValidating,getFieldValue} = this.props.form;
        var reg = new RegExp("<br>", "g");
        this.props.clickedRow.description = this.props.clickedRow.description?this.props.clickedRow.description.replace(reg, '\n'):this.props.clickedRow.description;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const formItemLayout2 = {
            labelCol: {span: 3},
            wrapperCol: {span: 19},
        };
        //子任务列表循环
        /*const subTask = this.state.subtask.map((desc,index) => {
            return (
                <Form.Item {...formItemLayout2} label={`子任务${index+1}：`} key={index+1}>
                    {getFieldDecorator(`subtask${index}`, {
                        initialValue: desc.description,
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入子任务描述...",
                        }],
                    })(
                        <Input style={{ width: '60%', marginRight: 8 }} />
                    )}
                    <Popconfirm placement="right" title='确认移除这条子任务？' onConfirm={this.remove.bind(this,index)} okText="确认" cancelText="取消">
                        <Button icon="close">移除</Button>
                    </Popconfirm>
                </Form.Item>
            );
        });*/
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
                                initialValue: this.props.clickedRow.introducer,
                                rules: [
                                    {required: true, message: '提出人不能为空'},
                                ],
                                validateTrigger:'onBlur'
                            })(
                                <Input id="introducer" name="introducer" type="text" placeholder="请输入姓名..."/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {/*责任人*/}
                        <FormItem
                            {...formItemLayout}
                            label="责任人"
                            hasFeedback
                            help={isFieldValidating('chargeperson') ? '验证中...' : (getFieldError('chargeperson') || []).join(', ')}
                        >
                            {getFieldDecorator('chargeperson', {
                                initialValue: this.props.clickedRow.chargeperson?this.props.clickedRow.chargeperson:this.props.user.nickname,
                                rules: [
                                    {required: true, message: '责任人不能为空'},
                                    {validator: this.userExists},
                                ],
                                validateTrigger:'onBlur'
                            })(
                                <Input id="chargeperson" name="chargeperson" type="text" placeholder="请输入姓名..."/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        {/*产品分类*/}
                        <FormItem
                            {...formItemLayout}
                            label="分类"
                            help={isFieldValidating('classify') ? '验证中...' : (getFieldError('classify') || []).join(', ')}
                        >
                            {getFieldDecorator('classify', {
                                initialValue: clickRowClassifyArray,
                                rules:[{ required: true,type: 'array',message:'请选择所在项目..'}]
                            })(
                                <Cascader changeOnSelect onChange={this.handleProjectChange.bind(this)} showSearch options={this.state.cascaderoptions} expandTrigger="hover"
                                          placeholder="请选择分类..."
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {/*所在状态*/}
                        <FormItem
                            {...formItemLayout}
                            label="状态"
                        >
                            {getFieldDecorator('status', {
                                initialValue: this.props.clickedRow.statusId?this.props.clickedRow.statusId.toString():'',
                                rules:[{ required: true,message:'请选择状态..'}]

                            })(
                                <Select showSearch id="status" placeholder="请选择状态..." disabled={this.props.clickedRow.supid?false:true}>
                                    {statusList}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="预计实现时间"
                        >
                            {getFieldDecorator('prtime',{
                                initialValue: this.props.clickedRow.prtime?moment(this.props.clickedRow.prtime):'',
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
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        {/*预计实现版本*/}
                        <FormItem
                            {...formItemLayout}
                            label="预计实现版本"


                        >
                            {getFieldDecorator('prversion', {
                                rules:[{ required: true,message:'请选择预计实现版本...'}]
                            })(
                                <Select onChange={this.props.form.resetFields([{names:['prversion']}])} placeholder='请选择版本...' notFoundContent="请选择所在项目..." id="select2" >
                                    {versionElement}
                                </Select>
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
                        initialValue: this.props.addSubInfo ? '' :this.props.clickedRow.title,
                        rules: [
                            {required: true, message: '主题不能为空'}
                        ],
                        validateTrigger:'onBlur'
                    })(
                        <Input id="title" name="title" type="text" placeholder="请输入主题..."/>
                    )}
                </FormItem>
                {/*优先级*/}
                <FormItem
                    {...formItemLayout2}
                    label="优先级"
                >
                    {getFieldDecorator('priority', {
                        initialValue:this.props.addSubInfo? '' : this.props.clickedRow.priority?this.props.clickedRow.priority.toString():'',
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
                </FormItem>
                <FormItem
                    labelCol={{span: 3}}
                    wrapperCol={{span: 10}}
                    label="整理进度"
                >
                    {getFieldDecorator('process',{
                        initialValue: this.props.addSubInfo ?0 : parseInt(this.props.clickedRow.process)
                    })(
                        <Slider marks={{0: '0%', 20: '20%', 40: '40%', 60: '60%', 80: '80%', 100: '100%'}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout2}
                    label="描述"
                    style={{marginTop: 50}}
                >
                    {getFieldDecorator('description',{
                        initialValue: this.props.addSubInfo ? '' : this.props.clickedRow.description
                    })(
                        <Input id="description" name="desc" type="textarea" rows={5} placeholder="请输入内容..."/>
                    )}
                </FormItem>
                {!this.props.addSubInfo&&_.has(this.props.clickedRow, 'supid')&&this.props.clickedRow.supid&&<div><Row style={{padding:'0 65px 0 45px'}}>
                    <Alert message="请及时保存编辑好的描述...."
                           type="warning"
                           showIcon
                           closable
                    />
                </Row>
                <Row>
                <Col span={3} className="ant-form-item-label"><label>需求描述</label></Col>
                    <Col span={19}>
                {this.detailsComponent()}
                    <div>
                    <Popconfirm placement="right" title={<div><p style={{marginBottom:'10px'}}>请输入需求用例名称...</p><Input ref="detailtitle" type="text"></Input></div>} onConfirm={this.confirm.bind(this)} okText="确认" cancelText="取消">
                    <Button type="dashed" icon="plus">添加需求用例</Button>
                    </Popconfirm>
                    </div>
                    </Col>
                    </Row></div>}

                <FormItem
                    {...formItemLayout2}
                    label="上传附件"
                    style={{marginTop: 50}}
                >
                    {getFieldDecorator('upload', {
                        valuePropName: 'fileList',
                        normalize: this.normFile,
                    })(
                        <Upload {...props} >
                            <Button type="ghost">
                                <Icon type="upload"/> 点击上传文件
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                {/*{subTask}
                <FormItem wrapperCol={{span: 16, offset: 3}}>
                    <Button icon="plus" onClick={this.add.bind(this)} style={{ marginRight: 8 }}>添加子任务</Button>
                </FormItem>*/}
                <FormItem wrapperCol={{span: 16, offset: 3}} style={{marginTop: 50}}>
                    {this.props.addSubInfo ?<Button loading={this.state.iconLoading} type="primary" htmlType="submit" icon="save">新建</Button>:<Button loading={this.state.iconLoading} type="primary" htmlType="submit" icon="save">保存</Button>}
                </FormItem>
            </Form>
        );
    }
}
EditForm = Form.create()(EditForm);