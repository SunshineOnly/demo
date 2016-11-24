var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./detailsSqlMapping');
var session = require('express-session');
var _ = require('lodash');
var async = require('async');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    saveRequireDetail:function(req,res,next){
        var param = req.body;
        pool.getConnection(function(err,connection){
            if(param.filesArr.length>0){
                var vlauesSql = '';
                var filesIdArr = [];
                param.filesArr.forEach(function (file, index) {
                    file.path = file.path.replace(/\\/g, "\\\\");
                    if (index < param.filesArr.length - 1) {
                        vlauesSql += '(' + file.id + ',\'' + file.originalfilename + '\',\''+ file.path + '\',\''+ file.type + '\','+ file.size + '),'
                    } else {
                        vlauesSql += '(' + file.id + ',\'' + file.originalfilename + '\',\''+ file.path + '\',\''+ file.type + '\','+ file.size + ')'
                    }
                    filesIdArr.push(file.id)
                });
                //设置 require表 fileid
                var filesIdStr = filesIdArr.join(',');
                connection.query(
                    'INSERT INTO xr_file (id, originalfilename,path,type,size) VALUES '+
                    vlauesSql,
                    function(err,result) {
                        if (err) {
                            console.log('add err:' + err);
                            res.send('fail');
                        }else{
                            connection.query(
                                sql.save,
                                [param.casename,param.involvemodule,param.involveuser,param.scencedescription,param.precondition,param.backcondition,param.requiredescription,param.acceptstandard,param.constraintrule,param.remark,param.requireid,filesIdStr],
                                function(err,rows){
                                    if(err){
                                        console.log('add err:' + err);
                                        res.send('fail');
                                    } else{
                                        res.send('success')
                                    }
                                    connection.release();
                                }
                            )
                        }
                    }
                )
            }else{
                var filesIdStr = null;
                connection.query(
                    sql.save,
                    [param.casename,param.involvemodule,param.involveuser,param.scencedescription,param.precondition,param.backcondition,param.requiredescription,param.acceptstandard,param.constraintrule,param.remark,param.requireid,filesIdStr],
                    function(err,rows){
                        if(err){
                            console.log('add err:' + err);
                            res.send('fail');
                        } else{
                            res.send('success')
                        }
                        connection.release();
                    }
                )
            }

        })
    },
    updateRequireDetail:function(req,res,next){
        var param = req.body;
        pool.getConnection(function(err,connection){
            if(param.filesArr.length>0){
                var vlauesSql = '';
                var filesIdArr = [];
                param.filesArr.forEach(function (file, index) {
                    file.path = file.path.replace(/\\/g, "\\\\");
                    if (index < param.filesArr.length - 1) {
                        vlauesSql += '(' + file.id + ',\'' + file.originalfilename + '\',\''+ file.path + '\',\''+ file.type + '\','+ file.size + '),'
                    } else {
                        vlauesSql += '(' + file.id + ',\'' + file.originalfilename + '\',\''+ file.path + '\',\''+ file.type + '\','+ file.size + ')'
                    }
                    filesIdArr.push(file.id)
                });
                //设置 require表 fileid
                var filesIdStr = filesIdArr.join(',');
                connection.query(
                    'INSERT INTO xr_file (id, originalfilename,path,type,size) VALUES '+
                    vlauesSql +
                    'ON DUPLICATE KEY UPDATE originalfilename=VALUES(originalfilename),path=VALUES(path),type=VALUES(type),size=VALUES(size); ',
                    function(err,result) {
                        if (err) {
                            console.log('add err:' + err);
                            res.send('fail');
                        }else{
                            connection.query(
                                sql.update,
                                [param.casename,param.involvemodule,param.involveuser,param.scencedescription,param.precondition,param.backcondition,param.requiredescription,param.acceptstandard,param.constraintrule,param.remark,param.requireid,filesIdStr,param.id],
                                function(err,rows){
                                    if(err){
                                        console.log('add err:' + err);
                                        res.send('fail');
                                    } else{
                                        res.send('success')
                                    }
                                    connection.release();
                                }
                            )
                        }
                    }
                )
            }else{
                var filesIdStr = null;
                connection.query(
                    sql.update,
                    [param.casename,param.involvemodule,param.involveuser,param.scencedescription,param.precondition,param.backcondition,param.requiredescription,param.acceptstandard,param.constraintrule,param.remark,param.requireid,filesIdStr,param.id],
                    function(err,rows){
                        if(err){
                            console.log('add err:' + err);
                            res.send('fail');
                        } else{
                            res.send('success')
                        }
                        connection.release();
                    }
                )
            }

        })
    },
    queryById:function(req,res,next){
        var param = req.query;
        pool.getConnection(function(err,connection){
            connection.query(
                sql.queryById,
                [param.id],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    } else if(rows.length>0){
                        //TODO:通过rows的fileid 获取原型示意图片信息
                        async.map(rows, function(row, callback) {
                            row.fileInfo = [];
                            var fileId = row.fileid;
                            if(fileId){
                                connection.query(
                                    'SELECT ' +
                                    '	id, ' +
                                    '	originalfilename, ' +
                                    '	path, ' +
                                    '	type, ' +
                                    '	size ' +
                                    'FROM ' +
                                    '	xr_file ' +
                                    'WHERE id in ('+fileId+')',
                                    function (err, result) {
                                        if (err) {
                                            console.log('search err' + err)
                                        } else if (result.length != 0) {
                                            row.fileInfo = result;
                                        }else{
                                            row.fileInfo = []
                                        }
                                        callback(null,row);
                                    }
                                )
                            }else{
                                callback(null,row);
                            }
                        },function(err,row){
                            res.send(row)
                            connection.release();
                        })
                    }else{
                        res.send([])
                        connection.release();
                    }
                }
            )
        })
    },
    delDetail:function(req,res,next){
        var param = req.body;
        var data = new Date();
        pool.getConnection(function(err,connection){
            connection.query(
                sql.delDetail,
                [1,data,param.id],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    }else{
                        res.send('success')
                    }
                    connection.release();
                }
            )
        })
    }
};