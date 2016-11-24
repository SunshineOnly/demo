/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import { Table } from 'antd';
import { Button ,Row,Modal} from 'antd';
import $ from 'jquery-ajax';
import moment from 'moment';
import _ from 'lodash';
import {ProductPriorityForm} from './PublishComponent/ProductPriorityForm';
import  myObject from '../myObject';
import '../../public/css/product_info.css';

export class ProductPublishTableLayout extends React.Component {

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
    updateTable(){
        var This=this;
        $.ajax({
            url:"/projetPublish/queryAllProducts",
            type:"post",
            async:false,
            success:function(resp){
                This.setState({
                    selectedRowKeys: [],
                    products:resp.products,
                    orignalProducts:resp.products
                })

            }
        })

    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount() {
        var This = this;
       this.updateTable();
        myObject.priorityCloseModal.add(This.closeModal.bind(this));
    }


    showModal() {
        var self=this;
        let  initDatas={
            productName:"",
            productPriority:"",
        }
        this.setState({
            orignalProduct:initDatas
        },function(){
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
            self.updateTable();
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
        this.setState({
            orignalProduct:this.state.orignalProducts[option.index]
        },function(){
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
            title: '产品名称',
            dataIndex: 'productName',
        },{
            title: '产品优先级',
            dataIndex: 'priority',
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


                </div>
                <Table   columns={columns} dataSource={this.state.products} />
                <Modal
                    visible={this.state.visible}
                    title="产品优先级"
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
                        <Button key="submit" type="primary" size="large"  onClick={this.handleOk.bind(this)}>
                            提交
                        </Button>,
                    ]}
                >
                 <ProductPriorityForm initDatas={this.state.orignalProduct} />
                </Modal>

            </div>
        );

    }

}

