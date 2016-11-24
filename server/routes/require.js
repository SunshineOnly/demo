/**
 * Created by Administrator on 2016/10/24.
 */
var express = require('express');
var router = express.Router();
var requireDao = require('../dao/requireDao');

//登录页面GET路由
router.route('/requires').post(function(req, res, next) {
    requireDao.queryAll(req, res, next);
});
router.route('/requiresbystatus').post(function(req, res, next) {
    requireDao.queryByStatus(req, res, next);
});
module.exports = router;