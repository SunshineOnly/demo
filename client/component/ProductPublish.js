/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import {ProductPublishTable} from './ProductPublishTable';
import {ProductPublishTableLayout} from './ProductPublishTableLayout';
import {ProjectPriorityTableLayout} from './ProjectPriorityTableLayout';
import {LeftNavBar} from './PublishComponent/LeftNavBar';
import { Row,Col} from 'antd';
import _ from 'lodash';
import  myObject from '../myObject';
export class ProductPublish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rightFlagStr:"ProductPublishTableLayout",
            right:<ProductPublishTableLayout />
        };
    }
    componentWillMount() {
        var This = this;
        myObject.menu1.add(This.updateRightCom.bind(this));

    }
    updateRightCom(data){
        if(data.keys=="产品"){
            this.setState({
                right:<ProductPublishTableLayout/>
            })
        }else if(data.keys=="项目"){
            this.setState({
                right:<ProjectPriorityTableLayout />
            })
        }else if(data.keys=="版本内容"){
            this.setState({
                right:<ProductPublishTable />
            })
        }
    }
    handleClick(e){
        console.log(e);
        if(e.key=="产品"||e.key=="项目"){
            if(this.state.rightFlagStr!="ProductPublishTableLayout"){
                this.setState({
                    rightFlagStr:"ProductPublishTableLayout",
                    right:<ProductPublishTableLayout/>
                })
            }

        }else{
            var keyPaths=_.map(e.keyPath,function(k,i){
                let strArr=k.split("_");
                return strArr[0];
            })
            if(this.state.rightFlagStr!="ProductPublishTable"){
                this.setState({
                    rightFlagStr:"ProductPublishTable",
                    right:<ProductPublishTable />
                },function(){
                    myObject.menu.dispatch([keyPaths[0],keyPaths[1]]);
                })
            }else{
                myObject.menu.dispatch([keyPaths[0],keyPaths[1]]);
            }






        }
    }
    render() {

        return (
            <Row className="">
                <Col lg={3} md={4} xs={24} sm={24}>
                <LeftNavBar handleClick={this.handleClick.bind(this)}/>
                 </Col>
                <Col lg={21} md={20} xs={24} sm={24} style={{padding:"40px"}}>

                    {this.state.right }
                 </Col>
            </Row>
        )
    }
}
