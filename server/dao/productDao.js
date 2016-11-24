/**
 * Created by Administrator on 2016/10/31.
 */
var mysql = require('mysql');
var db = require('../connection/db');
var sql = require('./productSqlMapping');
var session = require('express-session');
var moment=require('moment');
var _ =require('lodash');
var Product = require('../models/Product');
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
                        let ret={};
                        ret=_.groupBy(rows,function(item,index){
                            return item.productName;
                        });
                        let retArr=_.map(ret,function(item,index){
                            let temp={};
                            temp["productName"]=item[0].productName;

                            temp["projects"]= projectssArr=_.map(_.groupBy(item,function(project,xindex){
                                return project.projectName;
                            }),function(i,zindex){
                                return  {projectName:i[0].projectName,
                                 content:  _.map(i,function(ii){
                                     let updateInfo=[];
                                     if(ii.updateInfo){
                                         updateInfo=_.compact(ii.updateInfo.split("//"),"");
                                     }else{
                                         updateInfo=[""];
                                     }
                                     return {
                                         time:moment(ii.updateTime).format("YYYY-MM-DD"),
                                         status:ii.status,
                                         content:updateInfo,
                                         version:ii.version
                                     }
                                 })
                                } ;

                            });

                                return temp;
                        });
                        console.log(retArr)


                        res.send(retArr)
                    }
                    connection.release();
                }
            )
        })
    },

    insertAll: function (req, res,next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(
                sql.insertProjectPublish,
                [param.projectName,param.updateInfo,param.updateTime,param.status,param.version],
                function (err, rows) {
                    if (err) {
                        console.log('add project err' + err);
                        res.send({code:0,message:"add pproject err"});
                    } else if (rows.length != 0) {
                        let projectId=rows.insertId;
                        connection.query(sql.queryProductByName,[param.productName],function(err0,rows0){
                            if(err0){
                                console.log('add project err' + err);
                                res.send({code:0,message:"query Product err"});
                            }else if (rows0.length != 0){
                                let productId=rows0[0].id;
                                console.log("productId"+productId);
                                connection.query(
                                    sql.insertProduct_project,
                                    [productId,projectId],
                                    function (err2, rows2) {
                                        if (err2) {
                                            console.log('add product_project err' + err2);
                                            res.send({code:0,message:"add product_project err"});
                                        } else if (rows2.length != 0) {
                                            connection.release();
                                            res.send({code:1,message:"add success"});
                                        }

                                    }
                                )
                            }else{
                                connection.query(
                                    sql.insertProduct,
                                    [param.productName],
                                    function (err1, rows1) {
                                        if (err1) {
                                            console.log('add product err' + err1);
                                            res.send({code:0,message:"add product err"});
                                        } else if (rows1.length != 0) {
                                            let productId=rows1.insertId;
                                            console.log("productId"+productId);
                                            connection.query(
                                                sql.insertProduct_project,
                                                [productId,projectId],
                                                function (err2, rows2) {
                                                    if (err2) {
                                                        console.log('add product_project err' + err2);
                                                        res.send({code:0,message:"add product_project err"});
                                                    } else if (rows2.length != 0) {
                                                        connection.release();
                                                        res.send({code:1,message:"add success"});
                                                    }

                                                }
                                            )
                                        }

                                    }
                                )
                            }
                        });



                    }

                }
            )
        })
    },
    queryProducts:function (req, res,next) {
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryProducts,
                [],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {

                        console.log("rr"+rows);
                        let names= _.map(rows,function(r,i){
                            return r.productName;
                        })

                        res.send({productNames:names});
                    }
                    connection.release();
                }
            )
        })
    },
    queryProjectByName:function (req, res,next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryProjectsByName,
                [param.productName,param.projectName],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {

                       /* _.each(rows,function(row,ii){
                         let contentArr=row.updateInfo.split("//");
                         let content="";
                         _.each(contentArr,function(c,i){
                         content=content+" "+c;
                         });
                         row.updateInfo=content;
                         })*/
                        let ret=rows;


                        console.log("rr"+ret);

                        res.send({products:rows});
                    }
                    connection.release();
                }
            )
        })
    },
    queryProductsMenu:function (req, res,next) {
        var param = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryProductsMenu,
                [],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {
                        let productsArr=[];
                        productsArr=_.groupBy(rows,function(row){
                            return row.productName;
                        })
                        let rets= _.map(productsArr,function(product){
                                return {
                                    parentNames:product[0].productName,
                                    subNames:_.map(product,function(temp){
                                        return temp.projectName;
                                    })
                                }
                            })
                        console.log("rr"+rows);
                        res.send({products:rets});
                    }
                    connection.release();
                }
            )
        })
    },
    editProjectPublish: function (req, res,next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(
                sql.updateProjectPublish,
                [param.projectName,param.updateInfo,param.updateTime,param.status,param.version,param.id],
                function (err, rows) {
                    if (err) {
                        console.log('update project err' + err);
                        res.send({code:0,message:"update pproject err"});
                    } else if (rows.length != 0) {
                        console.log(rows);
                        res.send(rows);
                    }
                    connection.release();
                }
            )
        })
    },
    deleteProjectPublish: function (req, res,next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(
                sql.deleteProjectPublsish,
                [param.ids],
                function (err, rows) {
                    if (err) {
                        console.log('delete project err' + err);
                        res.send({code:0,message:"delete pproject err"});
                    } else if (rows.length != 0) {
                        console.log(rows);
                        res.send({code:1,message:"delete pproject success"});
                    }
                    connection.release();
                }
            )
        })
    },
    queryAllProducts:function (req, res,next) {
        pool.getConnection(function (err, connection) {
            connection.query(
                sql.queryAllProducts,
                [],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {

                        res.send({products:rows});
                    }
                    connection.release();
                }
            )
        })
    },
    updateProductPrioirty:function (req, res,next) {
        pool.getConnection(function (err, connection) {
            var param = req.body;
            connection.query(
                sql.updateProductPrioirty,
                [param.productPriority,param.id],
                function (err, rows) {
                    if (err) {
                        console.log('search err' + err)
                    } else if (rows.length != 0) {

                        res.send({code:1,message:"update product success"});
                    }
                    connection.release();
                }
            )
        })
    },
};