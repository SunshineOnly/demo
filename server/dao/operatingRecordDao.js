/**
 * Created by Administrator on 2016/11/22.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var operatingRecordSql = require('./operatingRecordSqlMapping');
var session = require('express-session');
var _ = require('lodash');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);
module.exports = {
    queryById:function(req,res,next){
        pool.getConnection(function(err,connection){
            var param = req.query;
            connection.query(
                operatingRecordSql.queryById,
                [param.id],
                function(err,rows){
                    if(err){
                        console.log('queryId err'+err)
                    }else{
                        res.send(rows)
                    }
                    connection.release();
                }
            )
        })
    }
}