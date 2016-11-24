/**
 * Created by Administrator on 2016/10/24.
 */
/**
 * Created by admin on 2016/10/23.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./statusMapping');
var session = require('express-session');
//创建数据库连接池
var pool = mysql.createPool(db.mysql);

module.exports = {
    queryAll: function (req, res,next) {
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryAll,
                [],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        res.send(rows)
                    }
                    connection.release();
                }
            )
        })
    }

};