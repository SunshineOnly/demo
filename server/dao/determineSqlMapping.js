/**
 * Created by Administrator on 2016/11/8.
 */
/**
 * Created by Administrator on 2016/11/3.
 */
var determine = {
    //获取最后一条数据的id
    selectAllAble:'SELECT * FROM xr_determine WHERE status = 0 ',
    upDateById:'update xr_require set determineid=?,status=2 where id =?',
};
module.exports = determine;