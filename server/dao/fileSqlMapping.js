/**
 * Created by Administrator on 2016/11/3.
 */
var require = {
    //获取最后一条数据的id
    queryLastId:'SELECT id FROM xr_file ORDER BY id DESC LIMIT 0,1 ',
};
module.exports = require;