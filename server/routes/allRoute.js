/**
 * Created by Administrator on 2016/10/25.
 */
/**
 * Created by Administrator on 2016/10/21.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var userDao = require('../dao/userDao');
var projectDao = require('../dao/projectDao');
var requireDao = require('../dao/requireDao');
var subTaskDao = require('../dao/subTaskDao');
var statusDao = require('../dao/statusDao');
var versionDao = require('../dao/versionDao');
var determineDao = require('../dao/determineDao');
var detailsDao = require('../dao/detailsDao');
var fileDao = require('../dao/fileDao');
var productDao = require('../dao/productDao');
var exportWordDao = require('../dao/exportWordDao');
var operatingRecordDao = require('../dao/operatingRecordDao');

function uploadParse(req,res){
    var form = new multiparty.Form({uploadDir: './public/files/'+req.query.id});
    form.parse(req, function (err, fields, files) {
        var filesTmp = files;
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            var dstPath = __filename+'/public/files/'+fields.id[0]+'/'+ inputFile.originalFilename;
            console.log(dstPath)
            //重命名为真实文件名
            /*fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });*/
        }
        res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.end(JSON.stringify({'fields': fields, 'files': filesTmp}));
    });
}
router.route('/fileuploading').post(function (req, res, next) {
    //判断带需求id的路径是否存在
    var folder_exists = fs.existsSync('./public/files/'+req.query.id);
    if(folder_exists){
        uploadParse(req,res)
    }else{
        //创建带 需求id的文件夹
        fs.mkdir('./public/files/'+req.query.id, 0o777,function(err){
            if(err){
                console.log(err)
            }else{
                //将上传文件  上传至 该文件夹中
                uploadParse(req,res)
            }
        })
    }

});

//登录页面路由
router.route('/loginUp').post(function (req, res, next) {
    userDao.queryName(req, res, next);
});
router.route('/logout').post(function(req, res, next) {
    req.session.user = null;
    res.send('success')
});
router.route('/loginUpAccount').post(function (req, res, next) {
    userDao.queryAccount(req, res, next);
});
router.route('/queryname').post(function (req, res, next) {
    userDao.queryNickName(req, res, next);
});

//项目菜单路由
router.route('/projectmenu').get(function (req, res, next) {
    projectDao.queryAll(req, res, next);
});
//版本路由
router.route('/versionbyproject').post(function (req, res, next) {
    versionDao.queryByProject(req, res, next);
});

//需求列表
router.route('/requires').get(function (req, res, next) {
    requireDao.queryByMenu(req, res, next);
});
router.route('/addNewRequire').post(function (req, res, next) {
    requireDao.addNewRequire(req, res, next);
});
router.route('/requirebyid').get(function (req, res, next) {
    requireDao.queryById(req, res, next);
});

router.route('/addrequire').post(function (req, res, next) {
    requireDao.saveRequire(req, res, next);
});
router.route('/updaterequire').post(function (req, res, next) {
    requireDao.updateRequire(req, res, next);
});
router.route('/requiresbystatus').post(function (req, res, next) {
    requireDao.queryByStatus(req, res, next);
});
router.route('/requiresbyproject').post(function (req, res, next) {
    requireDao.queryByProject(req, res, next);
});
router.route('/getSubTask').post(function (req, res, next) {
    requireDao.querySubTask(req, res, next);
});
router.route('/relevanceRequire').post(function (req, res, next) {
    requireDao.relevanceRequire(req, res, next);
});
//子任务查询
router.route('/getSubTaskLastId').post(function (req, res, next) {
    subTaskDao.queryLastId(req, res, next);
});
//附件处理
router.route('/getFileLastId').get(function (req, res, next) {
    fileDao.queryLastId(req, res, next);
});
router.route('/getFilesById').post(function (req, res, next) {
    requireDao.queryFilesById(req, res, next);
});
//状态菜单路由
router.route('/statusmenu').get(function (req, res, next) {
    statusDao.queryAll(req, res, next);
});
//归类路由
router.route('/determine').post(function (req, res, next) {
    determineDao.selectAllAble(req, res, next);
});
router.route('/determineupdate').post(function (req, res, next) {
    determineDao.upDateDetermine(req, res, next);
});
//需求详细描述
router.route('/saverequiredetail').post(function (req, res, next) {
    detailsDao.saveRequireDetail(req, res, next);
});
router.route('/updaterequiredetail').post(function (req, res, next) {
    detailsDao.updateRequireDetail(req, res, next);
});
router.route('/requiredetailsbyid').get(function (req, res, next) {
    detailsDao.queryById(req, res, next);
});
router.route('/delrequireDetail').post(function (req, res, next) {
    detailsDao.delDetail(req, res, next);
});


//查询产品
router.route('/products').post(function (req, res, next) {
    productDao.queryAll(req, res, next);
});
//更新产品版本说明
router.route('/publish/products').post(function (req, res, next) {
    productDao.insertAll(req, res, next);
});
router.route('/getProductNames').post(function (req, res, next) {
    productDao.queryProducts(req, res, next);
});


//导出word
router.route('/exportWord').post(function (req, res, next) {
    exportWordDao.exportWord(req, res, next);
});
router.route('/exportWordDownload').get(function (req, res, next) {
    var path = req.query.path;
    var filename = req.query.filename;
    res.download(path,filename)
});
//获取操作记录
router.route('/operatingRecord').get(function (req, res, next) {
    operatingRecordDao.queryById(req,res,next)
});

//根据项目名获取该项目下的版本记录
router.route('/getProjectsByName').post(function (req, res, next) {
    productDao.queryProjectByName(req, res, next);
});
router.route('/getProductsMenu').post(function (req, res, next) {
    productDao.queryProductsMenu(req, res, next);
});
router.route('/updateProjetPublish').post(function (req, res, next) {
    productDao.editProjectPublish(req, res, next);
});
router.route('/projetPublish/delete').post(function (req, res, next) {
    productDao.deleteProjectPublish(req, res, next);
});
router.route('/projetPublish/queryAllProducts').post(function (req, res, next) {
    productDao.queryAllProducts(req, res, next);
});
router.route('/projetPublish/updateProductPrioirty').post(function (req, res, next) {
    productDao.updateProductPrioirty(req, res, next);
});
module.exports = router;