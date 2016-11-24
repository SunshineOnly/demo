/**
 * Created by Administrator on 2016/10/21.
 */
var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');

//登录页面GET路由
router.route('/loginUp').post(function(req, res, next) {
    userDao.queryName(req, res, next);
});
router.route('/logout').post(function(req, res, next) {
    req.session.user = null;
    res.send('success')
});
router.route('/loginUpAccount').post(function(req, res, next) {
    userDao.queryAccount(req, res, next);
});
module.exports = router;