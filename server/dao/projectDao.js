/**
 * Created by admin on 2016/10/23.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./projectSqlMapping');
var session = require('express-session');
var _ =require('lodash');
var Project = require('../models/Project');
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
                        var supValue = new Array();
                        rows.forEach(function (row) {
                            row.subproject = new Array();
                            if (row.supproject) {
                                supValue.push(row);
                                _.find(rows, {id: row.supproject}).subproject.push(row);
                            }
                        });
                        supValue.map(function(row){
                            _.remove(rows, row);
                        })
                        res.send(rows)
                    }
                    connection.release();
                }
            )
        })
    }

};