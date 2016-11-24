/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Menu, Icon, Tooltip, Input,Popover,message,Tag} from 'antd';
import {TableAction} from './TableAction/TableAction';
import moment from 'moment';
import $ from 'jquery-ajax';
import myObject from '../../myObject';

function sendRecord(id){
    $.ajax({
        url:'/requirebyid',
        type:'GET',
        data:{id:id},
        success:function(result){
            if(result.length>0){
                var record = result[0];
                console.log(result)
                console.log(record)
                myObject.ShowDetailModal.dispatch(record,false,'')
            }else{
                message.error('获取失败请重试！')
            }

        }
    })

}

/**
 * 点击标题 淡出详情框
 * @param record  点击行的数据
 * @param mark  是否为 关联弹框 点击显示 （为了 关闭时 再弹出关联弹框）
 * @param id 如果为关联弹框 填出 记录 发送关联请求的 需求Id
 */
export function showModal(record,mark,id) {
    console.log(record)
    console.log(mark)
    var This = this;
    record.fileInfo = new Array();
    record.requireDetails = [];
    record.operatingrecord = [];
    if(mark){
        this.setState({
            closeMark:true
        })
    }else{
        this.setState({
            closeMark:false
        })
    }
    if(id){
        this.setState({
            relevanceId:id
        })
    }else{
        this.setState({
            relevanceId:''
        })
    }
    $.ajax({
        url: '/operatingRecord',
        type: 'GET',
        data: {id: record.id},
        success: function (result) {
            if(result.length>0){
                record.operatingrecord = result;
            }else{
                record.operatingrecord = [];
            }
            $.ajax({
                url:'/requiredetailsbyid',
                type:'GET',
                data:{id:record.id},
                success:function(result){
                    if(result=='fail'){
                        record.requireDetails = [];
                    }else{
                        record.requireDetails = result;
                    }
                    if (record.fileid) {
                        $.ajax({
                            url: '/getFilesById',
                            type: 'POST',
                            data: {id: record.fileid},
                            success: function (result) {
                                record.fileInfo = result;
                                This.setState({
                                    visible: true,
                                    clickedRow: record
                                });
                                console.log(record)
                            }
                        });
                    } else {
                        record.fileInfo = [];
                        This.setState({
                            visible: true,
                            clickedRow: record
                        });
                        console.log(record)
                    }
                }
            })

        }
    });
    //TODO:获取上传文件内容
    this.setState({
        visible: true,
        clickedRow: record
    });
}

function sendFilterByTitle(obj){
    myObject.filterByTitle.dispatch($("#titleInput")[0].value)
}
function sendFilterByIntroducer(obj){
    myObject.filterByIntroducer.dispatch($("#introducerInput")[0].value)
}
function sendFilterByChargeperson(obj){
    myObject.filterByChargeperson.dispatch($("#chargepersonInput")[0].value)
}
function sendResert(idName){
    console.log(idName)
    $("#"+idName)[0].value = '';
    myObject.tableDataResert.dispatch()
}

export const columns = function (object) {
    var columns = [{
        title: '需求ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        width: 120,
        fixed: 'left',
        render: text => {
            return <span>#Xr-{text}</span>
        }
    }, {
        title: '主题',
        dataIndex: 'title',
        width: 220,
        fixed: 'left',
        filterDropdown: <Menu>
            <Menu.Item key="0">
                <Input id="titleInput" size="small" placeholder="请输入要搜索的主题..." onPressEnter={sendFilterByTitle.bind(object)}/>
            </Menu.Item>
            <Menu.Item key="1">
                <div className="clearfix"><a
                    className="ant-table-filter-dropdown-link plr20 confirm" onClick={sendFilterByTitle.bind(object)}>确定</a><a
                    className="ant-table-filter-dropdown-link plr20 clear" onClick={sendResert.bind(object,'titleInput')}>重置</a></div>
            </Menu.Item>
        </Menu>,
        render: (text, record, index) => {
            return (
                <p key={`title-${record.id}`}>
                    <Tooltip title={text}>
                        <a href="javascript:void(0)" style={{
                            display: 'inline-block',
                            fontWeight: 'bold',
                            lineHeight: '20px',
                            maxWidth: '210px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                           onClick={showModal.bind(object, record,false,'')}>
                            <Icon type="edit" className="mr5"/>
                            {record.relevanceid?
                            <Popover placement="bottom"
                                     title={ <a href="javascript:void(0)"
                                                onClick={sendRecord.bind(this,record.relevanceid,'')}>查看已关联需求</a>}
                                     content={
                                         <div>
                                            <pre>关联原因：{record.reason}</pre>
                                        </div>
                                     }
                                     trigger="hover">
                                <span>{`【已关联Xr- ${record.relevanceid}】${text}`}</span></Popover>
                            :text}
                            </a>
                    </Tooltip>
                </p>

            )
        },

    }, {
        title: '跟踪',
        dataIndex: 'determine',
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return (<Tag>{text}</Tag>)
            }
        },
        width: 85,
        fixed: 'left'
    }, {
        title: '提出人',
        dataIndex: 'introducer',
        filterDropdown: <Menu>
            <Menu.Item key="0">
                <Input id="introducerInput" size="small" placeholder="请输入要搜索的提出人..." onPressEnter={sendFilterByIntroducer.bind(object)}/>
            </Menu.Item>
            <Menu.Item key="1">
                <div className="clearfix"><a
                    className="ant-table-filter-dropdown-link plr20 confirm" onClick={sendFilterByIntroducer.bind(object)}>确定</a><a
                    className="ant-table-filter-dropdown-link plr20 clear" onClick={sendResert.bind(object,"introducerInput")}>重置</a></div>
            </Menu.Item>
        </Menu>,
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return text
            }
        }
    }, {
        title: '提出时间',
        dataIndex: 'createtime',
        sorter: (a, b) => moment(a.createtime).format('x') - moment(b.createtime).format('x'),
        render: text => {
            if (text) {
                moment.locale('zh-cn')
                return <p>{moment(text).format('l')}</p>
            }
        },
    }, {
        title: '类型',
        dataIndex: 'classify',
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return text
            }
        }
    }, {
        title: '状态',
        dataIndex: 'status',

    }, {
        title: '整理进度',
        dataIndex: 'process',
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return text + '%'
            }
        }

    }, {
        title: '责任人',
        dataIndex: 'chargeperson',
        filterDropdown: <Menu>
            <Menu.Item key="0">
                <Input id="chargepersonInput" size="small" placeholder="请输入要搜索的责任人..." onPressEnter={sendFilterByChargeperson.bind(object)}/>
            </Menu.Item>
            <Menu.Item key="1">
                <div className="clearfix"><a
                    className="ant-table-filter-dropdown-link plr20 confirm" onClick={sendFilterByChargeperson.bind(object)}>确定</a><a
                    className="ant-table-filter-dropdown-link plr20  clear" onClick={sendResert.bind(object,'chargepersonInput')}>重置</a></div>
            </Menu.Item>
        </Menu>,
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return text
            }
        }
    }, {
        title: '优先级',
        dataIndex: 'priority',
        filters: [{
            text: '普通',
            value: 1,
        }, {
            text: '高',
            value: 2,
        }, {
            text: '紧急',
            value: 3,
        }],
        onFilter: (value, record) => record.priority == value,
        render: text=> {
            if (text == 1) {
                return <p className="fonC1">{'普通'}</p>
            } else if (text == 2) {
                return <p className="fonC3">{'高'}</p>
            } else if (text == 3) {
                return <p className="fonC2">{'紧急'}</p>
            } else {
                return '暂无'
            }
        }
    }, {
        title: '预计实现版本',
        dataIndex: 'prversion',
        sorter: (a, b) => a.prversion - b.prversion,
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return 'v ' + text
            }
        }
    }, {
        title: '预计实现时间',
        dataIndex: 'prtime',
        sorter: (a, b) => moment(a.prtime).format('x') - moment(b.prtime).format('x'),
        render: text => {
            if (text) {
                moment.locale('zh-cn')
                return <p>{moment(text).format('l')}</p>
            } else {
                return '暂无'
            }
        },
    }, {
        title: '实际实现版本',
        dataIndex: 'reversion',
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                return text
            }
        }
    }, {
        title: '实际实现时间',
        dataIndex: 'retime',
        render: text => {
            if (!text) {
                return '暂无'
            } else {
                moment.locale('zh-cn')
                return <p>{moment(text).format('l')}</p>
            }
        }
    }, {
        title: '操作',
        key: 'operation',
        dataIndex: '',
        className: 'h54',
        render: (text, record) => {
            return (
                <TableAction record={record}/>
            )
        },
        width: 80,
        fixed: 'right'
    }];
    return columns;
}


// rowSelection object indicates the need for row selection
export const rowSelection = {
    getCheckboxProps: record => ({
        //disabled: record.name === 'Jim Green',    // Column configuration not to be checked
    }),
};