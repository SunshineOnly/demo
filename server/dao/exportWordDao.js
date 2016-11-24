/**
 * Created by Administrator on 2016/11/15.
 */
var officegen = require('officegen');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
function sendPath(docx,res,requireId){
    var out = fs.createWriteStream ( 'public/words/'+requireId+'/需求文档Xr-'+requireId+'.docx' );// 文件写入
    out.on ( 'error', function ( err ) {
        console.log ( err );
    });
    async.series ([
        function ( done ) {
            out.on ( 'close', function () {
                done ( null );
            });
            //将内容写入文件中
            docx.generate ( out );
        },function(){
            //写入完成后 发送文件路径和地址
            res.send({path:out.path,filename:'需求文档Xr-'+requireId+'.docx'})
        }
    ], function ( err ) {
        if ( err ) {
            console.log ( 'error: ' + err );
        }
    });
}
function SwichValue(valueArray){
    valueArray.map(function(value){
        switch (value[0]){
            case 'casename':
                value[0] = '用例名称';
                break;
            case 'involvemodule':
                value[0] = '涉及模块';
                break;
            case 'involveuser':
                value[0] = '涉及用户';
                break;
            case 'scencedescription':
                value[0] = '场景描述';
                break;
            case 'precondition':
                value[0] = '前置条件';
                break;
            case 'backcondition':
                value[0] = '后置条件';
                break;
            case 'requiredescription':
                value[0] = '需求描述';
                break;
            case 'acceptstandard':
                value[0] = '验证标准';
                break;
            case 'constraintrule':
                value[0] = '约束规则';
                break;
            case 'remark':
                value[0] = '备注说明';
                break;
            case 'fileInfo':
                value[0] = '原型示意';
                break;
        }
    })
    return valueArray
}
function cell(value,width,b){
    return {val: value,
        opts: {
            cellColWidth: width,
            b: b,
            align: "left",
            vAlign: "center",
            sz: '20',
            fontFamily: "Microsoft YaHei"
        }
    }
}

module.exports = {
    exportWord: function(req, res,next) {
        var param = req.body;
        var requireId = param.id; //需求id
        var title = param.title; //需求主题
        var needsArray = [
            'casename',
            'involvemodule',
            'involveuser',
            'scencedescription',
            'precondition',
            'backcondition',
            'requiredescription',
            'acceptstandard',
            'constraintrule',
            'remark',
            'fileInfo'
        ]
        var requireDetails = param.requireDetails;
        var tableStyle = {
            tableColWidth: 5000,
            tableSize: 22,
            tableColor: "000",
            tableAlign: "center",
            tableFontFamily: "Microsoft YaHei",
            borders: true
        }  //表格样式


        var docx = officegen ('docx');
        docx.on ( 'finalize', function ( written ) {
            console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
        });
        docx.on ( 'error', function ( err ) {
            console.log ( err );
        });
        var pObj = docx.createP ( { align: 'center' } );// 创建行 设置居中
        pObj.addText ( title, { bold: true,font_face: 'Microsoft YaHei', font_size: 24 });// 添加文字 设置字体样式 加粗 大小
        function cell1 (value){
           return{ val: value,
            opts: {
                b: false,
                align: "left",
                vAlign: "center",
                sz: '20',
                shd: {
                    fill: "000",
                    themeFill: "text1",
                    "themeFillTint": "100"
                },
                fontFamily: "Microsoft YaHei"
            }
           }
        }
        var table = [
            [cell('文件名称', 3000, false), cell(title, 5000, false), cell('版本号', 3000, false), cell(param.prversion, 5000, false)],
            [cell('需求负责人', 3000, false), cell(param.chargeperson, 5000, false), cell('编写日期', 3000, false), cell(moment(param.prtime).format('l'), 5000, false)],
            [cell('更新内容', 3000, false), cell('', 5000, false),'',''],
            [cell('评审日期', 3000, false), '', cell('评审结果', 3000, false), ''],
            [cell1('评估结果确认'),cell1(''),cell1(''), cell1('')],
            [cell('产品组确认', 3000, false), '', '', ''],
            [cell('开发组确认', 3000, false), '', '', ''],
            [cell('测试组确认', 3000, false), '', '', ''],
            [cell('研发总监确认', 3000, false), '', '', ''],
            [cell('配置主管确认', 3000, false), '', '', ''],
        ];
        docx.createTable(table, tableStyle);



        /**
         * 生成用例表格方法
         */
        (function createTable() {
            requireDetails.map(function (detail) {
                var filteredDetail = _.pick(detail, needsArray)
                var valueArray = _.toPairsIn(filteredDetail); //将过滤后的对想转变为[key,value]的形式
                var newValueArray = SwichValue(valueArray); //将 key英文字段 转变为中文描述
                newValueArray.map(function (value) {
                    value[0] = {
                        val: value[0],
                        opts: {
                            cellColWidth: 4500,
                            b: true,
                            align: "left",
                            vAlign: "center",
                            sz: '20',
                            shd: {
                                fill: "E5E5E5",
                            },
                            fontFamily: "Microsoft YaHei"
                        }
                    };
                    value[1] = (function(){
                        if(!_.isArray(value[1])){
                            return {
                                val: value[1],
                                opts: {
                                    cellColWidth: 11500,
                                    b: false,
                                    align: "left",
                                    vAlign: "center",
                                    sz: '20',
                                    fontFamily: "Microsoft YaHei"
                                }
                            }
                        }else{
                            return (function(){
                                return value[1].map(function(o){
                                    var pObj = docx.createP()
                                    pObj.addImage(o.path)
                                })
                            })()
                        }
                    })()
                })
                var pObj = docx.createP({align: 'left'});// 创建行 设置居中
                pObj.addText(detail.casename + ' :', {bold: true, font_face: 'Microsoft YaHei', font_size: 16}); //创建表格标题
                docx.createTable(newValueArray, tableStyle);
                docx.putPageBreak ();
            })
        })();

        //判断带需求id的路径是否存在
        var folder_exists = fs.existsSync('./public/words/'+requireId);
        if(folder_exists){
            sendPath(docx,res,requireId)
        }else{
            //创建带 需求id的文件夹
            fs.mkdir('./public/words/'+requireId, 0o777,function(err){
                if(err){
                    console.log(err)
                }else{
                    sendPath(docx,res,requireId)
                }
            })
        }
    }
}
;