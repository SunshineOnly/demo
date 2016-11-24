/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Icon, Modal} from 'antd';
import {DetailInfo} from './DetailModalComponent/DetailInfo';
import {EditForm} from './DetailModalComponent/EditForm';
import $ from 'jquery-ajax';
import _ from 'lodash';
import myObject from '../../myObject';
export class DetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEdit: false,  //是否编辑  用于切换 编辑 与 展示信息组件
            addSubInfo: '',  //添加子任务的信息，默认为空,点击子任务按钮是传递数据
            privilege:false, //编辑权限
            user:{}
        };
    }

    componentWillMount() {
        this.handlePrivilege();
        var This = this;
        //生成时 查看是否有编辑权限
        $.ajax({
            url: '/session',
            type: 'GET',
            success: function (response) {
                if (response != 'fail'&& response.privilege) {
                    This.setState({
                        privilege:true
                    })
                }
            }
        })
        myObject.modelColse.add(this.handleModalClose.bind(this));
        myObject.backSupDetail.add(this.handleIfEditFalse.bind(this));
        myObject.addSubTask.add(this.handleAddSubTask.bind(this)); //新建子任务是显示编辑框
        //生成时 查看是否有编辑权限
        myObject.sessionStorageChange.add(this.handlePrivilege.bind(this));
    }

    /**
     * 接收用户信息判断权限
     */
    handlePrivilege(){
        var user = JSON.parse(sessionStorage.getItem("user"));
        if(user&&user.privilege==1){
            this.setState({
                privilege:true,
                user:user
            })
        }else{
            this.setState({
                privilege:false,
                user:{}
            })
        }
    }

    handleIfEditFalse() {
        this.setState({
            addSubInfo: '',
            ifEdit: false
        })
    }

    handleAddSubTask() {
        //点击添加子任务是 也去查找当前项目版本号
        myObject.modelShow.dispatch(this.props.clickedRow.classifyId, this.props.clickedRow.prversionId);
        this.setState({
            addSubInfo: this.props.clickedRow.id,
            ifEdit: true
        })
    }

    /**
     * 点击编辑按钮事件
     * 发送事件 去获取当前项目对应版本列表
     * */
    handleOk() {
        var This = this;
        myObject.modelShow.dispatch(This.props.clickedRow.classifyId, This.props.clickedRow.prversionId);
        if (this.state.ifEdit) {
            myObject.modelToInfo.dispatch();
        } else {
            myObject.modelToEdit.dispatch(This.props.clickedRow.fileInfo,This.props.clickedRow.requireDetails);
        }

        this.setState({
            addSubInfo: '',
            ifEdit: !this.state.ifEdit
        });
    }

    //当row needBack存在时
    handleBackSup(row) {
        myObject.clickSubDetail.dispatch(row)
    }

    handleModalClose() {
        this.setState({
            addSubInfo: '',
            ifEdit: false,
        });
    }
    /**
     * 权限警告通知框
     * */
    warningModal() {
        Modal.warning({
            title: '警告！',
            content: '抱歉，您暂无此权限...',
        });
    }

    hanleOkPrivilege(user){
        if(this.props.clickedRow.supid){
            return this.state.privilege&&(user.id==this.props.clickedRow.chargepersonid)?this.handleOk.bind(this):this.warningModal.bind(this)
        }else{
            return this.state.privilege?this.handleOk.bind(this):this.warningModal.bind(this)
        }
    }

    render() {
        const user =JSON.parse(sessionStorage.getItem("user"));
        return (
            <Modal title={'【需求】 # Xr-' + this.props.clickedRow.id} visible={this.props.visible}
                   style={{top: '20px',zIndex:'99999'}}
                   onOk={this.hanleOkPrivilege(user)}
                   okText={this.state.ifEdit ? <span><Icon type="double-left"/>&nbsp;&nbsp;返回</span> :
                       <span><Icon type="double-right"/>&nbsp;&nbsp;编辑</span>}
                   onCancel={_.has(this.props.clickedRow, 'needBack') ? this.handleBackSup.bind(this, this.props.clickedRow.father) : this.props.handleCancel}
                   cancelText={_.has(this.props.clickedRow, 'needBack') ? '返回父需求' : '取消'}
                   width={1200}  maskClosable={false}
            >
                <div className={this.state.ifEdit ? 'none' : ''} style={{height: 'auto', overflowY: 'auto'}}>
                    {/*需求详情组件 param:点击行信息 */}
                    <DetailInfo clickedRow={this.props.clickedRow}/>
                </div>
                <div className={this.state.ifEdit ? '' : 'none'} style={{height: 'auto', overflowY: 'auto'}}>
                    {/*修改表单组件*/}
                    <EditForm addSubInfo={this.state.addSubInfo} clickedRow={this.props.clickedRow}
                              handleCancel={this.props.handleCancel} user={this.state.user}/>
                </div>
            </Modal>
        );
    }
}