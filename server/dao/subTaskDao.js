/**
 * Created by Administrator on 2016/10/24.
 */
/**
 * Created by admin on 2016/10/23.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./subTaskSqlMapping');
var session = require('express-session');
var Project = require('../models/Project');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    queryLastId:function(req,res,next){
        pool.getConnection(function(err,connection){
            connection.query(
                sql.queryLastId,
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
                    } else if (rows.length != 0) {
                        res.send(rows)
                    }else{
                        res.send([])
                    }
                }
            )
        })
    }

};/**
 * Created by Administrator on 2016/10/31.
 */
