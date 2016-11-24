/**
 * Created by Administrator on 2016/10/21.
 */
var version = {
    queryByProject:'SELECT '+
    '	x.id, '+
    '	x.version, '+
    '	x.theme '+
    ' FROM xr_version x '+
    'JOIN xr_project p ON p.id = x.project '+
    'WHERE p.id=? '
};
module.exports = version;