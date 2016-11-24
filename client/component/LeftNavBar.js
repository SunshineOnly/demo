/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Menu, Icon,Switch} from 'antd';
import $ from 'jquery-ajax';
import myObject from '../myObject';
const SubMenu = Menu.SubMenu;
export class LeftNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '0',
            openKeys: [],
            wHeight: '',
            projectList:[]
        };
    }
    componentWillMount() {
        var This = this;
        $.ajax({
            type: 'GET',
            url: '/projectmenu',
            success: function (result) {
                This.setState({
                    projectList: result
                });
            }
        });
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
        const wHeight = window.innerHeight - 80 - 100;
        this.setState({
            wHeight: wHeight
        })
    }

    handleClick(e) {
        this.setState({current: e.key});
        this.props.ChangeCurrent(e.key);
        /**
         * 向主表格组件发送菜单key值
         */
        myObject.started.dispatch(e.key);
    }

    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => !(this.state.openKeys.indexOf(key) > -1));
        this.setState({openKeys: this.getKeyPath(latestOpenKey)});
    }

    getKeyPath(key) {
        const map = {
            sub1: ['sub1'],
            sub2: ['sub2'],
            sub3: ['sub2', 'sub3'],
            sub4: ['sub4'],
        };
        return map[key] || [];
    }

    //TODO:菜单循环
    item(rows) {
        return rows.map(function(row,index){
            if(row.subproject.length!=0){
                return (
                    <SubMenu key={'sub'+index} title={<span>{row.projectname}</span>}>
                        {this.item(row.subproject)}
                    </SubMenu>
                )
            }else{
                return <Menu.Item key={row.id}>{row.projectname}</Menu.Item>
            }
        }.bind(this))
    }
    render() {
        const wHeight = this.state.wHeight + 'px';
        const projectList = this.state.projectList;
        return (
            <div>
                <Menu
                    mode='inline'
                    openKeys={this.state.openKeys}
                    selectedKeys={[this.state.current]}
                    style={{width: '100%', height: wHeight}}
                    onOpenChange={this.onOpenChange.bind(this)}
                    onClick={this.handleClick.bind(this)}
                >
                    <Menu.Item key='0'>全部</Menu.Item>
                    {this.item(projectList)}
                </Menu>
            </div>
        );
    }
}