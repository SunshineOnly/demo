/**
 * Created by Administrator on 2016/11/8.
 */
import React from 'react';
import {Menu, Dropdown, Icon, Popover, Select, Modal} from 'antd';
import $ from 'jquery-ajax';
import myObject from '../../../myObject';
import {RelevanceEdit} from './RelevanceEdit';
const Option = Select.Option;

export class TableAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            determineList: [],
            privilege: false,
            visible: false,
            relevanceId:''
        }
    }

    componentWillMount() {
        myObject.ShowRelevanceModal.add(this.handleModalShow2.bind(this))
    }

    //TODO:点击获取 归类列表  待优化(最好只发送一次ajax)
    handleDaterMineList() {
        var This = this;
        $.ajax({
            url: '/session',
            type: 'GET',
            success: function (response) {
                if (response != 'fail' && response.privilege) {
                    This.setState({
                        privilege: true
                    }, function () {
                        if (this.state.determineList.length == 0) {
                            $.ajax({
                                url: '/determine',
                                type: 'POST',
                                success: function (response) {
                                    if (response != 'fail') {
                                        This.setState({
                                            determineList: response
                                        }, function () {
                                            console.log(This.state.determineList)
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    handleChange(value) {
        var This = this;
        console.log(`selected ${value}`);
        //TODO:更新当前记录
        $.ajax({
            url: '/determineupdate',
            type: 'POST',
            data: {id: This.props.record.id, determineId: parseInt(value)},
            success: function (result) {
                if (result == 'success') {
                    myObject.tableChange.dispatch()
                }
            }
        })
    }

    handleModalShow() {
        this.setState({
            visible: true
        })
    }
    handleModalShow2(id) {
        console.log(id)
        if(id==this.state.relevanceId){
            this.setState({
                visible: true,
                relevanceId:''
            })
        }
    }

    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    handleModalClose(){
        this.setState({
            visible:false
        })
    }

    handleChangeId(id){
        this.setState({
            relevanceId:id
        })
    }
    render() {
        const deterMineList = this.state.determineList.map(function (list) {
            return <Option key={list.id.toString()} value={list.id.toString()}>{list.determinename}</Option>
        })

        /**
         * 选择归类时  单选下拉框
         * @type {XML}
         */
        var content = (
            <div>
                <Select size="small" placeholder="请选择归类..."
                        defaultValue={this.props.record.determineid ? this.props.record.determineid.toString() : ''}
                        style={{width: 200, padding: '10px 0 10px 0'}} onChange={this.handleChange.bind(this)}>
                    {deterMineList}
                </Select>
            </div>
        );
        /**
         * 操作菜单
         * @type {XML}
         */
        var menu = (
            <Menu>
                <Menu.Item key="0"
                           style={{display: (this.state.privilege && this.props.record.statusId == 1) ? 'block' : 'none'}}>
                    <Popover content={content} title="归类" trigger="click">
                        <a href="javascript:void(0)">需求归类</a>
                    </Popover>
                </Menu.Item>
                <Menu.Item key="1" style={{display: (this.state.privilege) ? 'block' : 'none'}}>
                    <a href="javascript:void(0)" onClick={this.handleModalShow.bind(this)}>关联</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href="javascript:void(0)">待开发</a>
                </Menu.Item>
                <Menu.Item key="3">
                    <a href="javascript:void(0)">待开发</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#" onClick={this.handleDaterMineList.bind(this)}>操作 <Icon
                        type="down"/></a>
                </Dropdown>
                <Modal title='关联需求' visible={this.state.visible}
                       maskClosable={false}
                       width={800}
                       onCancel={this.handleCancel.bind(this)}
                       footer=""
                >
                    <RelevanceEdit handleChangeId={this.handleChangeId.bind(this)} handleModalClose={this.handleModalClose.bind(this)} record={this.props.record} />
                </Modal>
            </div>

        )
    }


}