var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./fileSqlMapping');
var session = require('express-session');
var _ = require('lodash');
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
                        res.send([{id:0}])
                    }
                }
            )
        })
    }
};