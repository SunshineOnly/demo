/**
 * Created by Administrator on 2016/11/11.
 */
import React from 'react';
import { Menu, Icon } from 'antd';
import $ from 'jquery-ajax';
import _ from 'lodash';
import  myObject from '../../myObject';
const SubMenu = Menu.SubMenu;
export class LeftNavBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current: '产品',
            products:[]
        };
    }

    handleClick(e) {
        this.props.handleClick(e);
    }


    componentWillMount(){
        var This=this;
        $.ajax({
            url:"/getProductsMenu",
            type:"post",
            async:false,
            success:function(resp){
             console.log(resp);
                This.setState({
                    products:resp.products
                })
            }
        })

    }
    componentDidMount(){
        var This=this;
    }
    initMenu(options){

        return (
            <Menu onClick={this.handleClick.bind(this)}
                  defaultSelectedKeys={["产品"]}
                  defaultOpenKeys={["页面排版"]}
                  selectedKeys={[this.state.current]}
                  mode="inline"

            >

                    <SubMenu key="页面排版" title="页面排版">
                        <Menu.Item key="产品">产品</Menu.Item>
                        {/*<Menu.Item key="项目">项目</Menu.Item>*/}
                    </SubMenu>

                <SubMenu key="版本内容" title={<span>版本内容</span>}>


                {options.map((option, index) => {
            return  ( <SubMenu key={`${option.parentNames}_${index}`} title={<span><span>{option.parentNames}</span></span>}>
                {option.subNames.map((sub,sindex) => {
                        return (<Menu.Item  key={`${sub}_${index}${sindex}`} >{sub}</Menu.Item>)
                        })}
                    </SubMenu>)

        })}
                </SubMenu>
            </Menu>
        );
    }

    render() {
        return (this.initMenu(this.state.products))
    }

}
