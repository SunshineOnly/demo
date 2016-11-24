/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Row, Col} from 'antd';
import {NewRequireForm} from './NewRequireForm';
//import {MyDraft} from './FormComponent/MyDraft';

export class NewRequire extends React.Component {
    render() {
        return (
            <div className="plr40">
                <Row>
                    <Col span={24}>
                        <p className="borb1" style={{padding: '5px 0 15px', marginBottom: '24px'}}>
                            <span className="f18">需求#236</span>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <NewRequireForm />
                    </Col>
                    <Col span={14}>
                        <div id="myDraft">
                            {/*<MyDraft />*/}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}