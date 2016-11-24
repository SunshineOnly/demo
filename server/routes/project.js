/**
 * Created by Administrator on 2016/10/24.
 */
var express = require('express');
var router = express.Router();
var projectDao = require('../dao/projectDao');

//登录页面GET路由
router.route('/projectmenu').post(function(req, res, next) {
    projectDao.queryAll(req, res, next);
});
module.exports = router;