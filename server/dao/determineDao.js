/**
 * Created by Administrator on 2016/11/8.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./determineSqlMapping');
var session = require('express-session');
var _ = require('lodash');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    selectAllAble:function(req,res,next){
        pool.getConnection(function(err,connection){
            connection.query(
                sql.selectAllAble,
                function(err,rows){
                    if(err){
                        console.log('add err:' + err);
                        res.send('fail');
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
    upDateDetermine:function(req,res,next){
        var param = req.body;
        pool.getConnection(function(err,connection){
            connection.query(
                sql.upDateById,
                [param.determineId,param.id],
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
        })
    }
};