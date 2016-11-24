/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import ReactQuill from 'react-quill';
import '../../../public/css/quill-snow.css';
export class MyDraft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: '',
            text:''
        };
        this.mixins = [ReactQuill.Mixin];
    }

    onTextChange(value) {
        this.setState({ text:value });
    }

    render() {
        return (
            <div style={{marginTop:'-15px'}}>
                <ReactQuill theme="snow"
                            value={this.state.text}
                            onChange={this.onTextChange.bind(this)} >
                    <ReactQuill.Toolbar key="toolbar"
                                        ref="toolbar"
                                        items={ReactQuill.Toolbar.defaultItems} />
                    <div key="editor"
                         ref="editor"
                         className="quill-contents"
                         style={{border:'1px solid #eee',height:'500px'}}
                          />
                </ReactQuill>
            </div>
        );
    }
}
