/**
 * Created by Administrator on 2016/10/27.
 */
/**
 * Created by Administrator on 2016/10/20.
 */
import {Row, Col, Affix, Collapse, Icon, Progress, Button, Tag, Popover} from 'antd';
import $ from 'jquery-ajax';
import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import {RequireShow} from '../RequireDetail/RequireShow';
import {ExportSelect} from '../DetailModalComponent/ExportSelect';
import {OperatingRecord} from './OperatingRecord';
import myObject from '../../../myObject';
const Panel = Collapse.Panel;

export class DetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privilege: false, //编辑权限
            show: false,
            iconLoading: false
        };
    }

    componentWillMount() {
        var This = this;
        this.setState({
            show: true
        });
        //生成时 查看是否有编辑权限
        this.handlePrivilege();
        myObject.sessionStorageChange.add(this.handlePrivilege.bind(this));
        /***进行其他操作时关闭 导出下拉弹框**/
        myObject.modelToEdit.add(this.handleExportCancel.bind(this));
        myObject.clickSubDetail.add(this.handleExportCancel.bind(this));
        myObject.addSubTask.add(this.handleExportCancel.bind(this));
        myObject.modelColse.add(this.handleExportCancel.bind(this));
        /**
         * 接收导出是 选择的数据 id
         */
        myObject.ExportSelectAccept.add(this.handleExportAccept.bind(this)) //接收点击导出确定后 发送回的 已选择用例

    }

    /**
     * 生成需求描述组件的子组件
     * @returns {Array}
     */
    handledetailsList() {
        return this.props.clickedRow.requireDetails.map((detail, index)=> {
            return (
                <Panel header={detail.casename} key={index}>
                    <RequireShow detail={detail} clickedRow={this.props.clickedRow}/>
                </Panel>
            )
        })
    }

    /**
     * 需求描述组件循环
     * @returns {XML}
     */
    detailsComponent() {
        if (this.props.clickedRow.requireDetails.length > 0) {
            return (
                <Collapse accordion style={{marginBottom: '20px'}} bordered={false}>
                    {this.handledetailsList()}
                </Collapse>
            )
        }
    }

    /**
     * 接收用户信息判断权限
     */
    handlePrivilege() {
        var user = JSON.parse(sessionStorage.getItem("user"));
        if (user && user.privilege == 1) {
            this.setState({
                privilege: true,
            })
        } else {
            this.setState({
                privilege: false,
            })
        }
    }

    /**
     * 根据优先级选择图标
     */

    selectIcon(priority) {
        if (priority == 1) {
            return (
                <p style={{paddingTop: '10px'}} className="fonC1">
                    <Icon type="smile-o" className="f14"/>
                    <span style={{
                        paddingLeft: '10px',
                        fontSize: '14px'
                    }}>普通</span>
                </p>
            )
        } else if (priority == 2) {
            return (
                <p style={{paddingTop: '10px'}} className="fonC3">
                    <Icon type="meh-o" className="f14"/>
                    <span style={{
                        paddingLeft: '10px',
                        fontSize: '14px'
                    }}>高</span>
                </p>
            )
        } else if (priority == 3) {
            return (
                <p style={{paddingTop: '10px'}} className="fonC2">
                    <Icon type="frown-o" className="f14"/>
                    <span style={{
                        paddingLeft: '10px',
                        fontSize: '14px'
                    }}>紧急</span>
                </p>
            )
        }
    }

    /**
     * 查看子任务内容
     *
     **/
    handleSubDetail(row, supRow) {
        row.fileInfo = [];
        row.requireDetails = [];
        row.operatingrecord = [];
        $.ajax({
            url: '/operatingRecord',
            type: 'GET',
            data: {id: row.id},
            success: function (result) {
                if (result.length > 0) {
                    row.operatingrecord = result;
                } else {
                    row.operatingrecord = [];
                }
                //TODO:获取上传文件内容
                $.ajax({
                    url: '/requiredetailsbyid',
                    type: 'GET',
                    data: {id: row.id},
                    success: function (result) {
                        if (result == 'fail') {
                            row.requireDetails = [];
                        } else {
                            row.requireDetails = result;
                        }
                        if (row.fileid) {
                            $.ajax({
                                url: '/getFilesById',
                                type: 'POST',
                                data: {id: row.fileid},
                                success: function (result) {
                                    row.fileInfo = result;
                                    row.needBack = true; //设置 需要返回标记
                                    myObject.clickSubDetail.dispatch(row, supRow)
                                }
                            });
                        } else {
                            row.fileInfo = [];
                            row.needBack = true; //设置 需要返回标记
                            myObject.clickSubDetail.dispatch(row, supRow)
                        }
                    }
                })
            }
        })
    }

    handleAddSubTask() {
        myObject.addSubTask.dispatch()
    }

    subTaskList(supRow) {
        if (_.has(supRow, 'children')) {
            return supRow.children.map((sub, index)=> {
                return (
                    <Row className="bord1 bgf" style={{padding: '10px 10px 10px 10px', marginTop: '20px'}} key={sub.id}>
                        <Col span={3} style={{minHeight: '28px', lineHeight: '28px'}}>
                            <Icon type="tags-o" className="f18" style={{verticalAlign: 'middle'}}/><span
                            className="ml5">子任务-{index + 1}&nbsp;&nbsp;
                            :</span>
                        </Col>
                        <Col span={21}>
                            <Row>
                                <Col span={20}><p style={{
                                    minHeight: '28px',
                                    lineHeight: '28px'
                                }}>{sub.title ? sub.title : '暂无主题...'}</p></Col>
                                <Col span={4}><Button icon="code-o" type="dashed"
                                                      onClick={this.handleSubDetail.bind(this, sub, supRow)}>查看详情</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                )
            });
        }
    }

    fileList(fileInfo) {
        if (fileInfo) {
            return fileInfo.map((file)=> {
                var newPath = _.clone(file.path)
                newPath = newPath.substr(6);
                return <a target="_blank" key={file.id} href={newPath} style={{display: 'block', paddingBottom: '7px'}}><Icon
                    type="link"/><span>{file.originalfilename}</span></a>
            })
        }
    };

    /**
     * 图片展示
     *
     * */
    picShow(fileInfo) {
        if (fileInfo) {
            return fileInfo.map((file, index)=> {
                var newPath = _.clone(file.path)
                var newType = _.clone(file.type)
                newPath = newPath.substr(6);
                var flagType = newType.substr(0, 5);
                if (flagType == 'image') {
                    return <Col key={index} span={8} style={{padding: '0 10px 0 10px'}}><img src={newPath} alt=""
                                                                                             style={{maxWidth: '100%'}}/></Col>
                }
            })
        }
    }

    handleExportWord(details) {
        var This = this;
        var data = _.clone(This.props.clickedRow);
        data.requireDetails = details
        this.setState({
            iconLoading: true
        });
        $.ajax({
            url: '/exportWord',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (result) {
                This.setState({
                    iconLoading: false,
                    exportVisible: false
                });
                location.href = '/exportWordDownload?path=' + result.path + '&filename=' + result.filename;
            }
        })
    }

    /**
     * 接收 ExportSelect 后筛选数据  导出选中的用例
     * */
    handleExportAccept(value) {
        var newDetails = [];
        var This = this;
        value.map(function (o) {
            o = parseInt(o);
            var detail = _.clone(_.find(This.props.clickedRow.requireDetails, {id: o}));
            newDetails.push(detail)
        })
        console.log(newDetails)
        this.handleExportWord(newDetails)
    }

    handleExport() {
        myObject.ExportSelectSend.dispatch();
    }

    handleExportClick() {
        this.setState({exportVisible: true})
    }

    handleExportCancel() {
        this.setState({exportVisible: false})
    }

    render() {
        //子任务列表循环
        const subTaskItem = this.subTaskList(this.props.clickedRow);
        const fileListItem = this.fileList(this.props.clickedRow.fileInfo);
        const picShow = this.picShow(this.props.clickedRow.fileInfo);
        const content = (
            <div>
                <ExportSelect details={this.props.clickedRow.requireDetails}/>
                <div style={{height: '30px', marginTop: '20px'}}>
                    <Button size="small" style={{float: 'right'}} type="primary"
                            loading={this.state.iconLoading}
                            onClick={this.handleExport.bind(this)}
                    >确认</Button>
                    <Button onClick={this.handleExportCancel.bind(this)} size="small"
                            style={{float: 'right', marginRight: '10px'}} type="ghost"
                    >取消</Button>
                </div>
            </div>
        );
        return (
            <div>
                <Row style={{borderBottom: '1px solid #e1e1e1', padding: '10px 0 20px 0'}} key="title">
                    <Col span={2} style={{paddingLeft: '10px'}}>
                        <Icon type="credit-card" style={{fontSize: '24px', verticalAlign: '-webkit-baseline-middle'}}/>
                    </Col>
                    <Col span={22} style={{paddingRight: '10px'}}>
                        {/*判断点击行数据中有无children属性 有增加 添加子任务按钮*/}
                        <div className="f18"><span
                            style={{paddingRight: '10px'}}>{this.props.clickedRow.title}</span>{this.props.clickedRow.determine &&
                        <Tag>{this.props.clickedRow.determine}</Tag>}{this.props.clickedRow.statusId != 1 && this.state.privilege && !this.props.clickedRow.supid &&
                        <Button style={{float: 'right', marginLeft: '10px'}} type="primary"
                                icon="plus"
                                onClick={this.handleAddSubTask.bind(this)}>添加子任务</Button>

                        }
                            {this.props.clickedRow.supid &&
                            <Popover visible={this.state.exportVisible} placement="bottom" content={content}
                                     title="选择导出用例" trigger="click">
                                <Button style={{float: 'right'}} type="primary"
                                        icon="export"
                                        onClick={this.handleExportClick.bind(this)}>导出Word</Button></Popover>}
                            {/*onClick={this.handleExportWord.bind(this)}*/}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={this.props.clickedRow.operatingrecord.length>0?6:0}>
                        <OperatingRecord clickedRow={this.props.clickedRow} />
                    </Col>
                    <Col span={this.props.clickedRow.operatingrecord.length>0?18:24}>
                        <Row style={{marginTop: '20px'}} key="introducer">
                            <Col className="require-detail-top" span={6}>
                                <p className="require-detail-title">提出人</p>
                                <p style={{paddingTop: '10px'}}>
                                    <img src="/img/header1.jpg" alt="" width="20" height="20"
                                         style={{verticalAlign: 'bottom', borderRadius: '50%'}}/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.introducer ? this.props.clickedRow.introducer : '暂无'}</span>
                                </p>
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">创建时间</p>
                                <p style={{paddingTop: '10px'}}>
                                    <Icon type="clock-circle-o" className="f14"/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{moment(this.props.clickedRow.createtime).format('l')}</span>
                                </p>
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">优先级</p>
                                {this.props.clickedRow.priority ? this.selectIcon(this.props.clickedRow.priority) :
                                    <p style={{paddingTop: '10px'}}>
                            <span style={{
                                paddingLeft: '10px',
                                fontSize: '14px'
                            }}>暂无</span>
                                    </p>}
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">负责人</p>
                                <p style={{paddingTop: '10px'}}>
                                    <img src="/img/header1.jpg" alt="" width="20" height="20"
                                         style={{verticalAlign: 'bottom', borderRadius: '50%'}}/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.chargeperson ? this.props.clickedRow.chargeperson : '暂无'}</span>
                                </p>
                            </Col>
                        </Row>
                        <Row style={{marginTop: '20px'}} key="prtime">
                            <Col className="require-detail-top" span={6}>
                                <p className="require-detail-title">预计实现时间</p>
                                <p style={{paddingTop: '10px'}}>
                                    <Icon type="clock-circle-o" className="f14"/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.prtime ? moment(this.props.clickedRow.prtime).format('l') : '暂无'}</span>
                                </p>
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">实际实现时间</p>
                                <p style={{paddingTop: '10px'}}>
                                    <Icon type="clock-circle-o" className="f14"/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.retime ? moment(this.props.clickedRow.retime).format('l') : '未完成'}</span>
                                </p>
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">预计实现版本</p>
                                <p style={{paddingTop: '10px'}}>
                                    <Icon type="code-o" className="f14"/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.prversion ? this.props.clickedRow.prversion : '暂无'}</span>
                                </p>
                            </Col>
                            <Col className="require-detail-top blnone" span={6}>
                                <p className="require-detail-title">实际实现版本</p>
                                <p style={{paddingTop: '10px'}}>
                                    <Icon type="code-o" className="f14"/>
                                    <span style={{
                                        paddingLeft: '10px',
                                        fontSize: '14px'
                                    }}>{this.props.clickedRow.reversion ? this.props.clickedRow.reversion : '未完成'}</span>
                                </p>
                            </Col>
                        </Row>
                        <Row className="bord1 bgf" style={{padding: '10px 10px 10px 10px', marginTop: '20px'}}
                             key="description">
                            <Col span={3}>
                                <Icon type="file-text" className="f18" style={{verticalAlign: 'bottom'}}/><span
                                className="ml5">描述&nbsp;&nbsp;
                                :</span>
                            </Col>
                            <Col span={21}>
                        <pre
                            style={{whiteSpace: 'pre-wrap'}}>{this.props.clickedRow.description ? this.props.clickedRow.description : '暂无描述...'}</pre>
                            </Col>
                        </Row>
                        <div key="subTaskItem" style={{marginBottom: '20px'}}>
                            {subTaskItem}
                        </div>
                        {this.detailsComponent()}
                        <Row style={{padding: '10px 10px 10px 10px', marginTop: '20px'}} key="Progress">
                            <Col span={12}>
                                <p className="pull-left f14 pl10">整理进度:</p>
                                <div className="pull-left pl45">
                                    <Progress type="circle" percent={parseInt(this.props.clickedRow.process)}/>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={5}>
                                        <p className="pull-left f14 pl10">附件列表:</p>
                                    </Col>
                                    <Col span={19}>
                                        <div className="pull-left pl20 detail-file-list">
                                            {fileListItem && fileListItem.length > 0 ? fileListItem : '暂无'}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{padding: '10px 10px 10px 10px', marginTop: '20px'}} type="flex"
                             justify="space-around"
                             align="middle" key="flex">
                            {picShow}
                        </Row>
                        {/*<Row style={{padding: '10px 10px 10px 10px', marginTop: '20px'}} key="History">
                            <Button type="primary">查看历史记录</Button>
                        </Row>*/}
                    </Col>

                </Row>

            </div>
        );
    }
}