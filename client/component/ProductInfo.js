/**
 * Created by Administrator on 2016/10/26.
 */
import React from 'react';
import { Timeline, Icon ,Carousel,Tag} from 'antd';
import $ from 'jquery-ajax';
import '../../public/css/product_info.css';
const COLOR={
    "1":"rgb(76, 226, 157)",
    "2":"rgb(45, 183, 245)",
    "3":"rgb(195, 166, 232)",
    "4":"rgb(221, 228, 156)",
    "5":"rgb(32, 189, 175)",
    "6":"rgb(241, 157, 54)",
    "7":"rgb(146, 134, 243)",
    "8":"#00BCD4"
}
export class ProductInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productArr:[],
            width:"",
            showTip:"none"

        };
    }

    renderItem(options){

        return (<div style={{display:"flex",padding:"20px"}} className="h" type="flex" justify="space-around" align="middle">
            {options.map((option, z) => {
            return (<div style={{float: "left", paddingRight:"20px",marginRight:"20px"}} className="h productItem"
                         key={`key-${z}`}>
                <h1 style={{textAlign: "center", marginBottom: "30px", fontSize: "24px",marginTop: "30px"}} className="">{option.productName}</h1>
                <ul style={{display:"flex",height: "80%",borderTop:"1px solid #ccc",borderBottom:"1px solid #ccc",borderLeft:"1px solid #ccc"}}>
                    {
                        option.projects.map((item, index) => {
                            return (

                                <li style={{
                                    float: "left",
                                    marginLeft: "20px",
                                    paddingRight: "20px",
                                    borderRight: "1px solid #ccc",

                                }} key={`afsd-${index}`}>
                                    <span style={{
                                        display: "inline-block",
                                        fontSize: "16px",
                                        marginTop: "20px",
                                        background: "#2db7f5",
                                        paddingLeft:"15px",
                                        paddingRight: "15px",
                                        paddingTop: "9px",
                                        paddingBottom: "9px",
                                        color: "#fff",
                                        borderRadius: "30px",
                                        marginLeft: "30px",
                                    }} className="">{item.projectName}</span>
                                    <div style={{ height:"40px",borderLeft:"2px solid #e9e9e9",marginLeft:"75px"}}></div>
                                    <Timeline className="" key={`asd-${index}`}>


                                        {
                                            item.content.map((temp, zindex) => {
                                                console.log(temp);
                                                var iconColor = temp.status === "1" ? "green" : "blue";
                                                return (
                                                    <Timeline.Item className="" style={{paddingBottom: "60px"}}
                                                                   key={`asd-${zindex}`}
                                                                   dot={<div style={{"width": "120px"}}>
                                                                       <h3 className="time-line-dot-time-content">
                                                                           <span
                                                                               className="time-line-dot-time-content-span">{`${temp.time.split("-")[1]}.${temp.time.split("-")[2]}`}</span><span
                                                                           className="time-line-dot-time-content-circle">{temp.time.split("-")[0]}
                                                        </span>
                                                                           <span
                                                                               className="time-line-dot-time-content-circle-version"
                                                                               style={{"color": "#ccc!important"}}>{temp.version}</span>
                                                                       </h3>
                                                                       <Icon type="clock-circle-o" style={{
                                                                           fontSize: '16px',
                                                                           marginLeft: '14px'
                                                                       }}/>
                                                                   </div>} color={iconColor}>
                                                        {temp.content.map((content,cindex)=>{
                                                            return     <p style={{
                                                            "whiteSpace": "normal",
                                                            fontSize: "14px"
                                                        }} key={`p+${cindex+1}`}>{content}</p>
                                                    })}


                                                    </Timeline.Item>
                                                );
                                            })}
                                    </Timeline>
                                </li>)
                        })
                    }
                </ul>
            </div>);
        })
        }
       </div> );

    }
    renderItem1(options){
        return (<Carousel effect="fade" className="h"  >
            {options.map((option, z) => {
                return (<div style={{}} className="h productItem"
                             key={`key-${z}`}>
                    <div style={{float:"right",marginTop:"30px",marginRight:"30px"}}>
                        <Tag color="green">已发布</Tag>
                        <Tag color="blue">开发中</Tag>
                        <Tag color="#ccc">历史版本</Tag>
                    </div>
                    <h1 style={{textAlign: "center", marginBottom: "40px", fontSize: "24px",marginTop: "30px"}} className="">{option.productName}</h1>

                    <ul style={{display:"flex",height: "84%",    justifyContent: "center"}}>
                        {
                            option.projects.map((item, index) => {
                                return (

                                    <li style={{
                                        float: "left",
                                        paddingTop:"20px",
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        marginRight:"15px",
                                        border: "1px solid #ccc",

                                    }} key={`afsd-${index}`} className="w300">
                                    <span style={{
                                        display: "inline-block",
                                        fontSize: "16px",
                                        marginTop: "20px",
                                        background: COLOR[index+1],
                                        paddingLeft:"15px",
                                        paddingRight: "15px",
                                        paddingTop: "9px",
                                        paddingBottom: "9px",
                                        color: "#fff",
                                        borderRadius: "30px",
                                        marginLeft: "30px",
                                    }} className="">{item.projectName}</span>
                                        <div style={{ height:"40px",borderLeft:"2px solid #e9e9e9",marginLeft:"75px"}}></div>
                                        <Timeline className="" key={`asd-${index}`}>


                                            {
                                                item.content.map((temp, zindex) => {
                                                    console.log(temp);
                                                    var iconColor = temp.status === 1 ? "green" : "blue";
                                                    if(temp.status == 1){
                                                        iconColor = "green" ;
                                                    }else if(temp.status == 2){
                                                        iconColor = "blue" ;
                                                    }else {
                                                        iconColor = "grey" ;
                                                    }
                                                    return (
                                                        <Timeline.Item className="" style={{paddingBottom: "60px"}}
                                                                       key={`asd-${zindex}`}
                                                                       dot={<div style={{"width": "120px"}}>
                                                                           <h3 className="time-line-dot-time-content">
                                                                           <span
                                                                               className="time-line-dot-time-content-span">{`${temp.time.split("-")[1]}.${temp.time.split("-")[2]}`}</span><span
                                                                               className="time-line-dot-time-content-circle">{temp.time.split("-")[0]}
                                                        </span>
                                                                               <span
                                                                                   className="time-line-dot-time-content-circle-version"
                                                                                   style={{"color": "#ccc!important"}}>{temp.version}</span>
                                                                           </h3>
                                                                           <Icon type="clock-circle-o" style={{
                                                                               fontSize: '16px',
                                                                               marginLeft: '10px'
                                                                           }}/>
                                                                       </div>} color={iconColor}>
                                                            {temp.content.map((content,cindex)=>{
                                                                return     <p style={{
                                                                    "whiteSpace": "normal",
                                                                    fontSize: "14px",
                                                                     lineHeight:"24px",
                                                                    letterSpacing:"1px"
                                                                }} key={`p+${cindex+1}`}>{content}</p>
                                                            })}


                                                        </Timeline.Item>
                                                    );
                                                })}
                                        </Timeline>
                                    </li>)
                            })
                        }
                    </ul>
                </div>);
            })
            }
        </Carousel> );

    }

    /**
     * 组件生成时 1.获取分类菜单 ;2.获取状态列表
     */
    componentWillMount(){
        var This = this;
        var clientWidth=document.documentElement.clientWidth*0.92;
        This.state.width=clientWidth;
        $.ajax({
            type: 'POST',
            url: '/products',
            async:false,
            success: function (resp) {
                console.log(resp);
                This.setState({
                    productArr:resp
                });
            }
        });
    }

    componentDidMount(){
        var This = this;
        This.setState({
            showTip:document.getElementsByClassName("productItem")[0].clientWidth>This.state.width?"inline-block":"none"
        });


    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.showTip=="none"){
            return false;
        }else{
            return true;
        }
    }
    render() {
        const ts= this.state.productArr;

        return (
            <div style={{whiteSpace:"nowrap",overflowX:"auto",overflowY:"hidden"}} className="h productPublish" >
                    {
                        this.renderItem1(ts)
                    }
               {/* <a style={{backgroundColor:"#2db7f5",clear:"both",display:this.state.showTip}} className="s-xguide-down trans" href="javascript:void(0)"  ></a>
                <a style={{clear:"both",display:this.state.showTip}} className="s-xguide-down arrow-1 trans" href="javascript:void(0)"  ></a>
                <span className="xguide-title" style={{display:this.state.showTip}}>向右滑动试试</span>*/}


            </div>
        )
    }
}
          