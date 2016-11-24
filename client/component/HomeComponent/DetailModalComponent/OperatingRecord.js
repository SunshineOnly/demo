/**
 * 操作记录
 */
import React from 'react';
import {Timeline,Button,Popover} from 'antd';
import moment from 'moment';
/**
 * 根据operatingrecord type改变提示文字
 */
function SwitchShow(value){
    switch(value.type){
        case 1:
            return value.operatorname?value.operatorname+'   更新了需求':'匿名   更新了需求'
            break;
        case 2:
            return `${value.operatorname}    添加了子任务`
            break;
    }
}
const content = (
    <div>
        <p>Content</p>
        <p>Content</p>
    </div>
);

export class OperatingRecord extends React.Component{
    operatingrecordList(operatingrecord){
        if (operatingrecord) {
            return operatingrecord.map((value)=> {
                return (
                    <Timeline.Item
                        dot={ <img src="/img/header1.jpg" alt="" width="25" height="25" style={{verticalAlign: 'middle', borderRadius: '50%'}}/>}
                        key={value.id}>
                        <div style={{paddingLeft:'10px',transform: 'translate(0px,-7px)'}}>
                            <p style={{paddingBottom:'5px',paddingRight:'30px'}}>{SwitchShow(value)} {value.type==1&&<Popover content={content} placement="right" title="变更内容" trigger="hover"><a className="pull-right">查看</a></Popover>}</p>
                            <p style={{color:'#9c9c9c'}}>{moment(value.createtime).format('lll')}</p>
                        </div>
                    </Timeline.Item>)
            })
        }
    };
    render(){
        const Item = this.operatingrecordList(this.props.clickedRow.operatingrecord);
        console.log(this.props.clickedRow.operatingrecord)
        return(
                <div style={{paddingTop:'30px',paddingLeft:'15px'}}>
                    <Timeline>
                        {Item}
                    </Timeline>
                </div>
        )
    }
}