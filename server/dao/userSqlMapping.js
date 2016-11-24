/**
 * Created by Administrator on 2016/10/21.
 */
var user = {
    insert: 'INSERT INTO xr_user(username, password,email,age,birthday, male, address,telephone,header_pic) VALUES (?,?,?,?,?,?,?,?,?)',
    update: 'update xr_user set username=?,password=?,email=?,age=?,birthday=?, male=?, create_time=?, update_time=?, is_delete=?, address=?,telephone=? where id=?',
    queryLogin: 'select * from xr_user where account=? and password=?',
    queryAccount: 'select * from xr_user where account=?',
    queryNickName: 'select * from xr_user where nickname=?',
    queryAll: 'select * from xr_user',
};
module.exports = user;