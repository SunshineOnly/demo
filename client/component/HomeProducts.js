/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Row, Col, Table} from 'antd';


//获取table数据

export class HomeProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wHeight: '',
            current: '0'
        };
    }

    componentWillMount() {
        this.changeHeight();
    }

    componentDidMount() {
        //窗口改变时的监听事件
        window.addEventListener('resize', this.changeHeight.bind(this));
    }

    /**
     * 改变主题高度，确保一屏
     */
    changeHeight() {
        const wHeight = window.innerHeight - 80 - 50;
        this.setState({
            wHeight: wHeight
        })
    }

    ChangeCurrent(current) {
        this.setState({
            current: current,
        })
    }

    render() {
        const Height = this.state.wHeight + 'px';
        return (
            <div className="main-wrapper" style={{height: Height,minHeight: Height,paddingTop:"0px"}}>
                <Row className="h">
                    <Col xs={24} sm={24} md={24} lg={24} className="h">
                        {this.props.children}
                    </Col>
                </Row>
            </div>
        )
    }
}