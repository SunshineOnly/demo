/**
 * Created by Administrator on 2016/9/19.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./userSqlMapping');
var session = require('express-session');
var _ =require('lodash-node');
var User = require('../models/User');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    //保存用户方法
    add: function (req, res, next,callback) {
        pool.getConnection(function(err,connection){
            var param = req.body;
            var paramArray = _.values(param);
            var user = new User();
            for(var key in param){
                user[key] = param[key];
            }
            connection.query(
                sql.insert,
                [user.username, user.password,user.email,user.age,user.birthday, user.male, user.address,user.telephone],
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
        })
    },
    //用户名密码匹配账户
    queryName:function(req, res, next){
        pool.getConnection(function(err,connection){
            var param = req.body;
            var user = new User();
            for(var key in param){
                user[key] = param[key];
            }
            connection.query(
                sql.queryLogin,
                [user.account,user.password],
                function(err,rows){
                    if(err){
                        console.log('search err:' + err);
                        res.send('fail');
                    }else{
                        if(rows.length!=0){
                            for(var key in user){
                                user[key] = rows[0][key]
                            }
                            req.session.user = user;
                            res.send('success');
                        }else{
                            res.send('fail');
                        }
                    }
                    connection.release();
                }
            )
        })
    },
    //查询用户名是否存在
    queryAccount:function(req, res, next){
        pool.getConnection(function(err,connection){
            var param = req.body;
            var user = new User();
            for(var key in param){
                user[key] = param[key];
            }
            connection.query(
                sql.queryAccount,
                [user.account],
                function(err,rows){
                    if(err){
                        console.log('search err:' + err);
                        res.send('fail');
                    }else{
                        if(rows.length!=0){
                            res.send('success');
                        }else{
                            res.send('fail');
                        }
                    }
                    connection.release();
                }
            )
        })
    },
    //根据用户昵称查询用户是否存在
    queryNickName:function(req, res, next){
        pool.getConnection(function(err,connection){
            var param = req.body.nickname;
            connection.query(
                sql.queryNickName,
                [param],
                function(err,rows){
                    if(err){
                        console.log('search err:' + err);
                        res.send('fail');
                    }else{
                        if(rows.length!=0){
                            res.send('success');
                        }else{
                            res.send('fail');
                        }
                    }
                    connection.release();
                }
            )
        })
    }
};





