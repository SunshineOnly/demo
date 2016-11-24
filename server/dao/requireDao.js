/**
 * Created by Administrator on 2016/10/24.
 */
/**
 * Created by admin on 2016/10/23.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./requireMapping');
var usersql = require('./userSqlMapping');
var subTaskSql = require('./subTaskSqlMapping');
var operatingRecordSql = require('./operatingRecordSqlMapping');
var session = require('express-session');
var Project = require('../models/Project');
var _ = require('lodash');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);
function queryByName(res,connection,param,callback){
    connection.query(
        usersql.queryNickName,
        [param],
        function(err,rows){
            if(err){
                console.log('add err:' + err);
                res.send('fail');
            }else{
                param = rows[0].id
            }
        }
    )
}
/**
 * 更新需求后 想operatingrecord表 添加 更新记录
 * param (connection,res,操作用户id,需求id)
 */

function addOperatingRecord(connection,res,userId,requireid,type){
    connection.query(
        operatingRecordSql.add,
        [type,userId,requireid],
        function(err,rows){
            if(err){
                console.log('add err:' + err);
                res.send('fail')
            }else{
                res.send('success')
            }
            connection.release();
        }
    )
}
function requireUpdatePublic(connection,res,param,filesIdStr){
    //TODO:require表更新操作
    connection.query(
        sql.update,
        [param.title,param.introducer,param.chargeperson,param.classify,param.description,param.priority,param.process,param.prtime,param.prversion,param.status,filesIdStr,param.id],
        function(err,result){
            if(err){
                console.log('add err:' + err);
                res.send('fail');
            }else{
                var parentClassify = param.classify;
                var parentStatus = param.status;
                //TODO:更新子任务 分类和状态
                //如果是父需求更新,查询该需求的子任务id
                if(!param.supid){
                    connection.query(
                        sql.queryBySupId,
                        [param.id],
                        function(err,subIds){
                            if(err){
                                console.log('err'+err)
                                connection.release();
                            }else{
                                //如果查询到的子任务id存在
                                if(subIds.length!=0){
                                    var newSubids = [];
                                    subIds.forEach(function(subId){
                                        newSubids.push(subId.id)
                                    })
                                    var subids = newSubids.join(',')
                                    connection.query(
                                        'update' +
                                        ' xr_require' +
                                        ' set classify='+parentClassify+',' +
                                        ' status='+parentStatus+
                                        ' WHERE id in ('+subids+')',
                                        function(err,final){
                                            if(err){
                                                console.log(err)
                                                res.send('fail');
                                            }else{
                                                addOperatingRecord(connection,res,param.loginUserId,param.id,1)
                                            }

                                        }
                                    )
                                }else{
                                    addOperatingRecord(connection, res, param.loginUserId, param.id,1);
                                }
                            }
                        }
                    )
                }
            }
        }
    )
}

module.exports = {
    saveRequire:function(req,res,next){
        pool.getConnection(function(err,connection){
            var param = req.body;
            param.prtime = new Date(param.prtime);
            connection.query(
                usersql.queryNickName,
                [param.chargeperson],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    }else{
                        param.chargeperson = rows[0].id;
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
                                            sql.add,
                                            [param.title,param.introducer,param.chargeperson,param.classify,param.description,param.priority,param.process,param.prtime,param.prversion,param.status,param.supid,filesIdStr,param.determine],
                                            function(err,result){
                                                if(err){
                                                    console.log('add err:' + err);
                                                    res.send('fail');
                                                }else{
                                                    addOperatingRecord(connection,res,param.loginUserId,param.id,2)
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }else{
                            var filesIdStr = null;
                            //TODO:require表更新操作
                            connection.query(
                                sql.add,
                                [param.title,param.introducer,param.chargeperson,param.classify,param.description,param.priority,param.process,param.prtime,param.prversion,param.status,param.supid,filesIdStr,param.determine],
                                function(err,result){
                                    if(err){
                                        console.log('add err:' + err);
                                        res.send('fail');
                                    }else{
                                        addOperatingRecord(connection,res,param.loginUserId,param.id,2)
                                    }
                                }
                            )
                        }

                    }
                }
            )
        })
    },
    //新建需求
    addNewRequire:function(req,res,next){
        pool.getConnection(function(err,connection){
            var param = req.body;
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
                                sql.addNewRequire,
                                [param.title,param.introducer,param.classify,param.description,param.status,filesIdStr],
                                function(err,result){
                                    if(err){
                                        console.log('add err:' + err);
                                        res.send('fail');
                                    }else{
                                        res.send('success');
                                    }
                                    connection.release();
                                }
                            )
                        }
                    }
                )
            }else{
                var filesIdStr = null;
                //TODO:require表更新操作
                connection.query(
                    sql.addNewRequire,
                    [param.title,param.introducer,param.classify,param.description,param.status,filesIdStr],
                    function(err,result){
                        if(err){
                            console.log('add err:' + err);
                            res.send('fail');
                        }else{
                            res.send('success');
                        }
                        connection.release();
                    }
                )
            }
        })
    },
    //更新需求方法
    updateRequire:function(req,res,next){
        pool.getConnection(function(err,connection){
            var param = req.body;
            param.prtime = new Date(param.prtime);
            //根据传入的负责人昵称 查找用用id
            connection.query(
                usersql.queryNickName,
                [param.chargeperson],
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    }else{
                        param.chargeperson = rows[0].id;
                        //判断filesArr的长度
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
                                        //TODO:require表更新操作
                                        requireUpdatePublic(connection,res,param,filesIdStr)
                                    }
                                }
                            )
                        }else{
                            var filesIdStr = null;
                            //TODO:require表更新操作
                            requireUpdatePublic(connection,res,param,filesIdStr)
                        }

                    }
                }
            )
        })
    },
    queryAll: function (req, res,next) {
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryAll,
                [],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        //TODO:根据子任务id查询子任务
                        res.send(rows)
                    }
                    connection.release();
                }
            )
        })
    },
    queryByStatus: function (req, res,next) {
        var param = req.body.status;
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryByStatus,
                [param],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        res.send(rows)
                    }else{
                        res.send([])
                    }
                    connection.release();
                }
            )
        })
    },
    queryByProject: function (req, res,next) {
        var param = req.body.project;
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryByProject,
                [param],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        res.send(rows)
                    }else{
                        res.send([])
                    }
                    connection.release();
                }
            )
        })
    },
    queryByMenu: function (req, res,next) {
        var param = req.query;
        var projectId = param.project;
        var statusId = param.status;
        var mainSql = sql.queryByProject;
        var values = [];
        if(statusId=='0'&&projectId=='0'){
            mainSql = sql.queryAll;
        }else if(statusId=='0'&&projectId!='0'){
            mainSql = sql.queryByProject;
            values = [projectId];
        }else if(statusId!='0'&&projectId=='0'){
            mainSql = sql.queryByStatus;
            values = [statusId];
        }else{
            mainSql = sql.queryByMenu;
            values = [statusId,projectId];
        }
        pool.getConnection(function (err, connection) {
            connection.query(
                mainSql,
                values,
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        //TODO:根据supid判断是不是子需求  将子需求设置为父需求的children属性
                        if(statusId<3){
                            var needRemove = []; //记录 需删除的需求id(存在父级的需求 存在父级children中)
                            rows.forEach(function (row,index) {
                                if (row.supid) {
                                    var supRow = _.find(rows, function (o) {
                                        return o.id == row.supid
                                    });
                                    if(!_.has(supRow, 'children')){
                                        supRow.children = [];
                                    }
                                    row.key = row.id;
                                    needRemove.push(row.id);
                                    supRow.children.push(row)
                                }else{
                                    row.key = row.id;
                                }
                            });
                            needRemove.forEach(function (id) {
                                rows = _.filter(rows, function (o) {
                                    return o.id != id;
                                });
                            });
                        }
                        res.send(rows)
                    }else{
                        res.send([])
                    }
                    connection.release();
                }
            )
        })
    },
    queryFilesById: function (req, res,next) {
        var param = req.body;
        var filesId = param.id;
        //判断子任务是否存在
        if(filesId){
            pool.getConnection(function (err, connection) {
                connection.query(
                    'SELECT ' +
                    '	id, ' +
                    '	originalfilename, ' +
                    '	path, ' +
                    '	type, ' +
                    '	size ' +
                    'FROM ' +
                    '	xr_file ' +
                    'WHERE id in ('+filesId+')',
                    function (err, rows) {
                        if (err) {
                            console.log('search err' + err)
                        } else if (rows.length != 0) {
                            res.send(rows)
                        }else{
                            res.send([])
                        }
                        connection.release();
                    }
                )
            })
        }else{
            res.send([])
        }

    },
    querySubTask: function (req, res,next) {
        var param = req.body;
        var subTaskId = param.id;
        //判断子任务是否存在
        if(subTaskId){
            pool.getConnection(function (err, connection) {
                connection.query(
                    'SELECT ' +
                    '	id, ' +
                    '	description ' +
                    'FROM ' +
                    '	xr_subtask ' +
                    'WHERE id in ('+subTaskId+')',
                    function (err, rows) {
                        if (err) {
                            console.log('search err' + err)
                        } else if (rows.length != 0) {
                            res.send(rows)
                        }else{
                            res.send([])
                        }
                        connection.release();
                    }
                )
            })
        }else{
            res.send([])
        }

    },
    queryById: function (req, res,next) {
        var param = req.query;
        var requireid = param.id;
        //判断子任务是否存在
        if(requireid){
            pool.getConnection(function (err, connection) {
                connection.query(
                    sql.queryById,
                    [requireid],
                    function (err, rows) {
                        if (err) {
                            console.log('search err' + err)
                        } else if (rows.length != 0) {
                            //TODO:根据supid判断是不是子需求  将子需求设置为父需求的children属性
                            var needRemove = []; //记录 需删除的需求id(存在父级的需求 存在父级children中)
                            rows.forEach(function (row,index) {
                                if (row.supid) {
                                    var supRow = _.find(rows, function (o) {
                                        return o.id == row.supid
                                    });
                                    if(!_.has(supRow, 'children')){
                                        supRow.children = [];
                                    }
                                    row.key = row.id;
                                    needRemove.push(row.id);
                                    supRow.children.push(row)
                                }else{
                                    row.key = row.id;
                                }
                            });
                            needRemove.forEach(function (id) {
                                rows = _.filter(rows, function (o) {
                                    return o.id != id;
                                });
                            });
                            res.send(rows)
                        }else{
                            res.send([])
                        }
                        connection.release();
                    }
                )
            })
        }else{
            res.send([])
        }
    },
    relevanceRequire:function (req, res,next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.relevanceRequire,
                [param.reason,param.relevanceid,param.id],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                        res.send('fail')
                    }else{
                        res.send('success')
                    }
                    connection.release();
                }
            )
        })
    },

};