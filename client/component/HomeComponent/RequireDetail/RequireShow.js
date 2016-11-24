import React from 'react';
import {Timeline,Button} from 'antd';
import _ from 'lodash';

export class RequireShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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
                    return <a href={newPath} target="_blank" style={{padding: '0 10px 0 10px'}}><img src={newPath} alt=""
                                                                                             style={{maxWidth: '30%'}}/></a>
                }
            })
        }
    }
    render() {
        const picShow = this.picShow(this.props.detail.fileInfo);
        return (
            <Timeline>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">用例名称</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.casename}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">涉及模块</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.involvemodule}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">涉及用户</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.involveuser}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">场景描述</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.scencedescription}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">前置条件</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.precondition}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">后置条件</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.backcondition}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">需求描述</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.requiredescription}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">验收标准</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.acceptstandard}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">约束规则</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.constraintrule}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">备注规则</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {this.props.detail.remark}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
                <Timeline.Item color="green" >
                    <div style={{borderRadius:'4px',overflow:'hidden',transform: 'translate(0, -12px)',paddingBottom:'10px'}}>
                        <p className="requireDetailShow-title">原型示意</p>
                        <div style={{padding:'10px 10px 0px 20px'}}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>
                                {picShow}
                            </pre>
                        </div>
                    </div>
                </Timeline.Item>
            </Timeline>
        )
    }
}