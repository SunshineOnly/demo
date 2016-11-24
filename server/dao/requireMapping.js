/**
 * Created by Administrator on 2016/10/24.
 */
var publicSql = 'SELECT ' +
    '	x.id, ' +
    '	x.title, ' +
    '	x.description, ' +
    '	x.createtime, ' +
    '	x.priority, ' +
    '	x.process, ' +
    '	x.prtime, ' +
    '	x.retime, ' +
    '	x.subtask, ' +
    '	x.supid, ' +
    '	x.fileid, ' +
    '	x.introducer, ' +
    '	x.relevanceid, ' +
    '	x.reason, ' +
    '	m.nickname as chargeperson, ' +
    '	m.id as chargepersonid, ' +
    '	p.projectname as classify, ' +
    '	p.id as classifyId, ' +
    '	v.version as reversion, ' +
    '	b.version as prversion, ' +
    '	b.id as prversionId, ' +
    '	s.id as statusId, ' +
    '	s.statusname as status, ' +
    '	d.determinename as determine, ' +
    '	d.id as determineid ' +
    'FROM ' +
    '	xr_require x ' +
    'LEFT JOIN xr_user m ON m.id = x.chargeperson ' +
    'LEFT JOIN xr_project p ON p.id = x.classify ' +
    'LEFT JOIN xr_version v ON v.id = x.reversion ' +
    'LEFT JOIN xr_version b ON b.id = x.prversion ' +
    'LEFT JOIN xr_status s ON s.id = x.status '+
    'LEFT JOIN xr_determine d ON d.id = x.determineid ';
var require = {
    add:'INSERT INTO xr_require(title,introducer,chargeperson,classify,description,priority,process,prtime,prversion,status,supid,fileid,determineid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
    addNewRequire:'INSERT INTO xr_require(title,introducer,classify,description,status,fileid) VALUES (?,?,?,?,?,?)',
    update: 'update xr_require set title=?,introducer=?,chargeperson=?,classify=?,description=?, priority=?, process=?, prtime=?, prversion=?, status=?, fileid=? where id=?',
    queryAll: publicSql,
    queryByStatus:publicSql +
    'WHERE x.status = ?',
    queryByProject:publicSql+
    'WHERE x.classify = ?',
    queryByMenu:publicSql+
    'WHERE x.status = ? AND x.classify = ? ',
    queryBySupId:'select id from xr_require where supid=?',
    queryById:publicSql+
    'WHERE x.id = ? ',
    relevanceRequire: 'update xr_require set status=7 ,reason=?, relevanceid=? where id=?',

};
module.exports = require;