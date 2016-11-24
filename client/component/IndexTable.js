/**
 * Created by Administrator on 2016/10/20.
 */
/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Icon, Table, Modal} from 'antd';
import $ from 'jquery-ajax';
import {TopNav} from './HomeComponent/TopNav';
import {DetailModal} from './HomeComponent/DetailModal';
import myObject from '../myObject';
import {columns, rowSelection,showModal} from './HomeComponent/MainTable';
import _ from 'lodash';
export class IndexTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            loading: false,
            project: '0',
            status: '0',
            visible: false,
            clickedRow: '',
            closeMark:false, //如果是 关联对话框 查看详情按钮弹出  标记设为true
            relevanceId:'' //发送关联请求的 需求id
        }
        this.oldData = '';
    }

    componentWillMount() {
        this.handleStautsChange(this.state.status);
        myObject.started.add(this.handleProjectChange.bind(this));
        myObject.tableChange.add(this.handleTableChange.bind(this));
        //点击子任务详情时更改state
        myObject.clickSubDetail.add(this.handleClickedRowChange.bind(this));
        myObject.filterByTitle.add(this.handleFilterByTitle.bind(this))
        myObject.filterByIntroducer.add(this.handleFilterByIntroducer.bind(this))
        myObject.filterByChargeperson.add(this.handleFilterByChargeperson.bind(this))
        myObject.tableDataResert.add(this.handleResert.bind(this))
        myObject.ShowDetailModal.add(showModal.bind(this))
        myObject.DetailsSaved.add(this.handleDetailsChange.bind(this))

    }
    handleDetailsChange(values){
        var This = this;
        if(values.id){
            var newState = _.clone(This.state.clickedRow);
            var index = _.findIndex(newState.requireDetails, {id: values.id});
            newState.requireDetails[index] = values;
            This.setState({
                clickedRow:newState
            })
        }else{
            var newState2 = _.clone(This.state.clickedRow);
            newState2.requireDetails.push(values);
            This.setState({
                clickedRow:newState2
            })
        }
    }

    handleResert(){
        console.log(this.oldData)
        this.setState({
            data:this.oldData
        })
    }

    /**
     * 处理 标题搜索
     * @param value 接收MainTable发送的input框value
     */
    handleFilterByTitle(value) {
        var newData = _.filter(this.state.data, function (record) {
            return record.title.includes(value)
        });
       this.setState({
           data:newData
       })
    }
    /**
     * 处理 提出人
     * @param value 接收MainTable发送的input框value
     */
    handleFilterByIntroducer(value) {
        var newData = _.filter(this.state.data, function (record) {
            return record.introducer?record.introducer.includes(value):null
        });
        this.setState({
            data:newData
        })
    }
    /**
     * 处理 责任人
     * @param value 接收MainTable发送的input框value
     */
    handleFilterByChargeperson(value) {
        var newData = _.filter(this.state.data, function (record) {
            return record.chargeperson?record.chargeperson.includes(value):null
        });
        this.setState({
            data:newData
        })
    }

    //改变点击行信息 用于处理子父需求详情切换
    handleClickedRowChange(row, supRow) {
        if (supRow) {
            row.father = supRow
        }
        this.setState({
            clickedRow: row
        })
        myObject.backSupDetail.dispatch()
    }

    handleOk() {
        myObject.modelColse.dispatch(false);
        this.setState({
            visible: false,
        });
    }

    handleCancel(e) {
        myObject.modelColse.dispatch(false);
        if(this.state.closeMark){ //如果关闭标记为true 显示关联对话框 （TableAction）
            myObject.ShowRelevanceModal.dispatch(this.state.relevanceId)
        }
        this.setState({
            closeMark: false,
            visible: false,
        });
    }

    //TODO:表格编辑后 数据刷新重新渲染表格
    handleTableChange() {
        this.setState({
            loading: true,
        });
        var This = this;
        $.ajax({
            url: '/requires',
            type: 'GET',
            data: {status: This.state.status, project: This.state.project},
            success: function (result) {
                result.forEach(function (row) {
                    row.key = row.id;
                });
                This.oldData = result;
                This.setState({
                    data: result,
                    loading: false
                })
                console.log('表格刷新了')
            }
        })
    }

    /**
     * 点击状态菜单更改表格内容
     * param 点击菜单的 key值
     */
    handleStautsChange(data) {
        this.setState({
            loading: true,
            status: data
        });
        var This = this;
        $.ajax({
            url: '/requires',
            type: 'GET',
            data: {status: data, project: This.state.project},
            success: function (result) {
                console.log(result)
                This.oldData = result;
                This.setState({
                    data: result,
                    loading: false
                })
            }
        })
    }

    /**
     * 点击项目菜单更改表格内容
     * param 点击菜单的 key值
     */
    handleProjectChange(data) {
        this.setState({
            loading: true,
            project: data
        });
        var This = this;
        $.ajax({
            url: '/requires',
            type: 'GET',
            data: {project: data, status: This.state.status},
            success: function (result) {
                result.forEach(function (row) {
                    row.key = row.id;
                });
                This.oldData = result;
                This.setState({
                    data: result,
                    loading: false
                })
            }
        })
    }

    render() {
        /*生成主表格*/
        const table = function () {
            if (this.state.data) {
                return <Table loading={this.state.loading} pagination={{pageSize: 11}}
                              rowSelection={rowSelection}
                              columns={columns(this)} dataSource={this.state.data} scroll={{x: 1650}}/>
            }
        }.bind(this);
        /*生成详情弹框*/
        const Modals = function () {
            if (this.state.clickedRow) {
                return (
                    <DetailModal clickedRow={this.state.clickedRow} visible={this.state.visible}
                                 hanleOk={this.handleOk.bind(this)} handleCancel={this.handleCancel.bind(this)}/>
                )
            }
        }.bind(this);
        return (
            <div>
                <TopNav handleStautsChange={this.handleStautsChange.bind(this)}/>
                <div style={{padding: '0 40px'}}>
                    {table()}
                </div>
                {Modals()}
            </div>
        )
    }
}