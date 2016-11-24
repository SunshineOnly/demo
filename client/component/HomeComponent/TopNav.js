/**
 * Created by Administrator on 2016/10/20.
 */
import { Menu, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import React from 'react';
import $ from 'jquery-ajax'

export class TopNav extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current: '0',
            status:[]
        };
    }
    componentWillMount(){
        var This = this;
        $.ajax({
            url: '/statusmenu',
            type: 'GET',
            success: function (result) {
                result.forEach(function (row) {
                    row.key = row.id.toString();
                });
                This.setState({
                    status: result
                })
            }
        })
    }
    handleClick(e) {
        this.setState({
            current: e.key,
        });
        this.props.handleStautsChange(e.key)
    }

    menuItems (status) {
        return status.map(function (menu) {
            return (
                <Menu.Item key={menu.key}>
                    {menu.statusname}
                </Menu.Item>
            )
        }.bind(this))
    };
    render() {
        const status = this.state.status;
        return (
            <div style={{padding:'0 40px'}}>
                    <Menu onClick={this.handleClick.bind(this)}
                          selectedKeys={[this.state.current]}
                          mode="horizontal"
                    >

                        <Menu.Item key="0">
                            全部
                        </Menu.Item>
                        {this.menuItems(status)}
                    </Menu>
            </div>
        );
    }
}