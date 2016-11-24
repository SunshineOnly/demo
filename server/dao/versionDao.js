/**
 * Created by Administrator on 2016/10/26.
 */
/**
 * Created by Administrator on 2016/9/19.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./versionSqlMapping');
var session = require('express-session');
var _ =require('lodash');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    //根据项目id查询版本号
    queryByProject: function (req, res, next) {
        pool.getConnection(function(err,connection){
            var param = req.body.project;
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
    }
};





