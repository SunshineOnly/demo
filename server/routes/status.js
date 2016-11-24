/**
 * Created by Administrator on 2016/10/24.
 */
var express = require('express');
var router = express.Router();
var statusDao = require('../dao/statusDao');

//登录页面GET路由
router.route('/statusmenu').post(function(req, res, next) {
    statusDao.queryAll(req, res, next);
});
module.exports = router;