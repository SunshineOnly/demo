/**
 * Created by Administrator on 2016/10/31.
 */
var require = {
    queryById:'SELECT ' +
    '	id, ' +
    '	description ' +
    'FROM ' +
    '	xr_subtask ' +
    'WHERE id in (?)',
    //获取最后一条数据的id
    queryLastId:'SELECT id FROM xr_subtask ORDER BY id DESC LIMIT 0,1 ',
    //根据id 更新
    updateSubTask:'update xr_subtask set description=? where id = ?'
};
module.exports = require;