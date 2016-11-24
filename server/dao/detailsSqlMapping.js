/**
 * Created by Administrator on 2016/11/3.
 */
var details = {
    //获取最后一条数据的id
    save:'INSERT INTO xr_detail(casename,involvemodule,involveuser,scencedescription,precondition,backcondition,requiredescription,acceptstandard,constraintrule,remark,requireid,fileid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    update:'UPDATE xr_detail SET casename=?,involvemodule=?,involveuser=?,scencedescription=?,precondition=?,backcondition=?,requiredescription=?,acceptstandard=?,constraintrule=?,remark=?,requireid=?,fileid=? WHERE id=?',
    queryById:'SELECT * FROM xr_detail WHERE requireid = ? AND status=0',
    delDetail:'UPDATE xr_detail SET status=?,updatetime=? WHERE id=?'
};
module.exports = details;