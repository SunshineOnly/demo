/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import { Table } from 'antd';
import { Button ,Row,Modal} from 'antd';
import $ from 'jquery-ajax';
import moment from 'moment';
import _ from 'lodash';
import {ProductPublishForm} from './ProductPublishForm';
import {ProductPublishForm1} from './ProductPublishForm';
import  myObject from '../myObject';
import '../../public/css/product_info.css';



export class ProductPublishTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,

            visible: false,
        };
    }
    start() {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }


    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount() {
        var This = this;
        myObject.menu.add(This.updateTable.bind(this));
      myObject.ajaxSubmit.add(This.closeModal.bind(this));
    }
    componentDidMount() {
        var This = this;


    }

    updateTable(option){
        this.setState({pathOption:option});
        var This=this;
        $.ajax({
            url:"/getProjectsByName",
            type:"post",
            async:false,
            data:{
                productName:option[1],
                projectName:option[0]
            },
            success:function(resp){
                let statusContentMap={
                    0:"历史版本",
                    1:"已发布",
                    2:"开发中"
                };
                This.setState({
                    selectedRowKeys: [],
                    projects:_.map(resp.products,function(temp,index){
                            let contentArr=temp.updateInfo.split("//");
                            let content="";
                            _.each(contentArr,function(c,i){
                                content=content+" "+c;
                            });
                    return {
                        name:temp.projectName,
                        updateInfo:content,
                        version:temp.version,
                        updateTime:moment(temp.updateTime).format("YYYY-MM-DD"),
                        status:statusContentMap[temp.status]
                    }

                }),
                orignalProjects:_.map(resp.products,function(project,i){
                    project.productName=option[1];
                    return project;
                })
                })

            }
        })

    }
    showModal() {
        var self=this;
        let  initDatas={
            productName:"",
            productPriority:"",
            projectName:"",
            projectPriority:"",
            status:"",
            updateTime:moment(),
            updateInfo:"",
            version:"",
            content:[]
        }

        this.setState({
            keys:[1],
            orignalProject:initDatas
        },function(){
            myObject.initProductModal.dispatch([1]);
            myObject.initProductPriorityModa2.dispatch({
                action:"add",
                data:initDatas
            });
            self.setState({
                visible: true,
            });
        })
    }
    closeModal(){
        var self=this;
        this.setState({
            visible: false,

        },function(){
            self.updateTable(self.state.pathOption);
        });
    }
    handleOk() {
        document.getElementsByClassName("publishSubmit")[0].click();
    }
    handleCancel() {
        this.setState({ visible: false });
    }
    editModal(option){
        var self=this;
        let contentArr=[];let content=[],keys=[];
        contentArr=this.state.orignalProjects[option.index].updateInfo.split("//");
        _.each(contentArr,function(c,i){
            if(c!=""){
                content.push(c);
                keys.push(i+1);
            }

        });
        this.state.orignalProjects[option.index].content=content;
        this.setState({
            keys:keys,
            orignalProject:this.state.orignalProjects[option.index]
        },function(){
            myObject.initProductModal.dispatch(keys);
            myObject.initProductPriorityModa2.dispatch({
                action:"edit",
                data:self.state.orignalProjects[option.index]
            });
            self.setState({
                visible: true,
            });
        })
    }
    deleteRecord(){
        var self=this;

        let ids=_.map(this.state.selectedRowKeys,function(k,i){
            return self.state.orignalProjects[k].id*1;
        })
        console.log("delete ids"+ids);
            $.ajax({
                url:"/projetPublish/delete",
                type:"post",
                data:{ids:ids[0]},
                success:function(resp){
                    console.log("delete"+resp);
                    if(resp.retcode==1){
                        console.log("delete success")
                    }else{
                        console.log("delete err")
                    }

                }
            })
    }
    render() {
        var self=this;
        const columns = [{
            title: '版本号',
            dataIndex: 'version',
        },{
            title: '版本说明',
            dataIndex: 'updateInfo',
        },{
            title: '发布时间',
            dataIndex: 'updateTime',
        }, {
            title: '版本状态',
            dataIndex: 'status',
        },{
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: function(text,record,index){
                return <a href="javascript:void(0)" onClick={self.editModal.bind(self,{text:text,index:index})}>编辑</a>;
            }  },

        ];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.showModal.bind(this)}
                             loading={loading}
                    >新增</Button>
                    {/*<Button type="primary" onClick={this.deleteRecord.bind(this)}
                            loading={loading}  style={{marginLeft:"10px"}}
                    >删除</Button>*/}
                    <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
                </div>
                <Table  rowSelection={rowSelection} columns={columns} dataSource={this.state.projects} />
                <Modal
                    visible={this.state.visible}
                    title="新增版本内容"
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
                        <Button key="submit" type="primary" size="large"  onClick={this.handleOk.bind(this)}>
                            发布
                        </Button>,
                    ]}
                >
                 <ProductPublishForm initDatas={this.state.orignalProject} keys={this.state.keys}/>
                </Modal>

            </div>
        );

    }

}

