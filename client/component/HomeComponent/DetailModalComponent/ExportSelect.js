import React from 'react';
import {TreeSelect} from 'antd';
import myObject from '../../../myObject';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

/*const treeData = [{
 label: 'Node1',
 value: '0-0',
 key: '0-0',
 children: [{
 label: 'Child Node1',
 value: '0-0-0',
 key: '0-0-0',
 }],
 }, {
 label: 'Node2',
 value: '0-1',
 key: '0-1',
 children: [{
 label: 'Child Node3',
 value: '0-1-0',
 key: '0-1-0',
 }, {
 label: 'Child Node4',
 value: '0-1-1',
 key: '0-1-1',
 }, {
 label: 'Child Node5',
 value: '0-1-2',
 key: '0-1-2',
 }],
 }];*/
function Model(label, value, key) {
    return {
        label: label,
        value: value.toString(),
        key: key,
    }
}
export class ExportSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: []
        };
    }

    componentWillMount() {
        myObject.ExportSelectSend.add(this.handleExportSelectSend.bind(this))
    }

    handleExportSelectSend(){
        myObject.ExportSelectAccept.dispatch(this.state.value)
    }

    onChange(value) {
        console.log('onChange ', value, arguments);
        this.setState({value});
    }

    render() {
        const details = this.props.details;
        const treeData = [];
        details.map(function (detail, index) {
            var newItem = Model(detail.casename, detail.id, index)
            treeData.push(newItem)
        })
        console.log(treeData)

        const tProps = {
            treeData,
            value: this.state.value,
            onChange: this.onChange.bind(this),
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择用例...',
            style: {
                width: 300,
            },
        };
        return <TreeSelect {...tProps} />;
    }
}
