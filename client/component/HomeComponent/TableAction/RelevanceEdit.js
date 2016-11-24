import React from 'react';
import {Steps, Input, Button, message} from 'antd';
import $ from 'jquery-ajax';
import _ from 'lodash';
import myObject from '../../../myObject';
const Step = Steps.Step;
/**
 * 点击标题 淡出详情框
 * @param record
 */
export class RelevanceEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: {},
            value: '',
            areaValue: '',
            current: 0,
        };
    }
    /**
     * 搜索框改变 获取值
     * @param e
     */
    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    handleAreaChange(e) {
        this.setState({
            areaValue: e.target.value,
        });
    }

    handleSearch() {
        $.ajax({
            url: '/requirebyid',
            type: 'GET',
            data: {id: this.state.value},
            success: function (result) {
                console.log(result)
            }
        })
    }

    next() {
        var This = this;
        if (this.props.record.id == this.state.value) {
            message.error('无法关联本需求！')
        } else {
            if (this.state.current == 0) {
                $.ajax({
                    url: '/requirebyid',
                    type: 'GET',
                    data: {id: This.state.value},
                    success: function (result) {
                        This.setState({
                            record: result[0]
                        });
                        if (result && result.length > 0) {
                            const current = This.state.current + 1;
                            This.setState({current});
                        } else {
                            message.error('此需求不存在')
                        }
                    }
                })
            } else if (this.state.current == 1) {
                if (_.isEmpty(this.state.areaValue)){
                    message.error('关联原因不能为空！')
                }else{
                    const current = This.state.current + 1;
                    This.setState({current});
                }
            }
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    handleShowDetail(record) {
        this.props.handleModalClose();
        this.props.handleChangeId(this.props.record.id);
        myObject.ShowDetailModal.dispatch(record,true,this.props.record.id)
    }

    /**
     * 确认关联方法
     */
    handleCommit(){
        var This = this;
        var relevanceid = this.state.value;
        var reason = this.state.areaValue;
        $.ajax({
            url:'/relevanceRequire',
            type:'POST',
            data:{reason:reason,relevanceid:relevanceid,id:this.props.record.id},
            success:function(result){
                This.props.handleModalClose()
                if(result=='success'){
                    myObject.tableChange.dispatch()
                    message.success('关联成功！')
                    This.setState({
                        record: {},
                        value: '',
                        areaValue: '',
                        current: 0
                    })
                }else{
                    message.error('关联失败！')
                }
            }
        })
    }
    render() {
        const {current} = this.state;
        const steps = [{
            title: '第一步',
            content: <div>
                <p style={{textAlign: 'center', fontSize: '16px', marginBottom: '40px'}}>请输入要关联的需求ID</p>
                <div style={{width: '400px', margin: '0 auto'}}>
                    <Input size="large" placeholder="请输入需求Id" value={this.state.value}
                           onChange={this.handleInputChange.bind(this)}
                    />
                </div>
            </div>
            ,
        }, {
            title: '第二步',
            content: <div>
                <Button onClick={this.handleShowDetail.bind(this, this.state.record)} type="primary"
                        style={{margin: '-10px auto 20px'}}>查看被关联需求</Button>
                <p style={{textAlign: 'center', fontSize: '16px', marginBottom: '10px'}}>输入关联原因</p>
                <div style={{width: '400px', margin: '0 auto'}}>
                    <Input style={{marginBottom: '20px'}} type="textarea" size="large" placeholder="请输入关联原因" rows={6}
                           onChange={this.handleAreaChange.bind(this)}
                    />
                </div>
            </div>
            ,
        }, {
            title: '第三步',
            content:
                <div>
                    <p style={{textAlign: 'center', fontSize: '18px', marginBottom: '10px'}}>是否确认关联需求 Xr-{this.state.value}？</p>
                    <p style={{textAlign: 'center', fontSize: '14px', marginBottom: '10px'}}>关联原因：{this.state.areaValue}</p>
                </div>,
        }];
        return (
            <div>
                <div>
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title}/>)}
                    </Steps>
                    <div className="steps-content">{steps[this.state.current].content}</div>
                    <div className="steps-action">
                        {
                            this.state.current < steps.length - 1
                            &&
                            <Button type="primary" onClick={() => this.next()}>下一步</Button>
                        }
                        {
                            this.state.current === steps.length - 1
                            &&
                            <Button type="primary" onClick={this.handleCommit.bind(this)}>确认</Button>
                        }
                        {
                            this.state.current > 0
                            &&
                            <Button style={{marginLeft: 8}} type="ghost" onClick={() => this.prev()}>
                                上一步
                            </Button>
                        }
                    </div>
                </div>
            </div>
        )
    }


}
