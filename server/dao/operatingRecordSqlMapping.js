/**
 * Created by Administrator on 2016/11/22.
 */
var operatingRecordSqlMapping = {
    //获取最后一条数据的id
    add:'INSERT INTO xr_operatingrecord(type,operator,requireid) VALUES (?,?,?)',
    queryById:'SELECT ' +
    '	x.id, ' +
    '	x.type, ' +
    '	x.operator, ' +
    '	x.createtime, ' +
    '	x.requireid, ' +
    '	u.nickname as operatorname ' +
    'FROM ' +
    '	xr_operatingrecord x ' +
    'LEFT JOIN xr_user u ON u.id = x.operator '+
    'WHERE x.requireid = ? '+
    ' ORDER BY createtime DESC'
};
module.exports = operatingRecordSqlMapping;