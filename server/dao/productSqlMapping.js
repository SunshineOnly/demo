/**
 * Created by admin on 2016/10/23.
 */
var project = {
    queryAll:'select a.* from (select pd.productName,pro_pub.projectName ,pro_pub.updateInfo,pro_pub.updateTime,pro_pub.version,pro_pub.status ,pp.priority from xr_product as pd  INNER JOIN xr_product_project as pp on pd.id =pp.productId   INNER JOIN  xr_project_publish as pro_pub on pp.projectId=pro_pub.id ORDER BY pd.priority asc, pp.priority asc ,pro_pub.updateTime desc ) as a where 5> ( select COUNT(*) from (select pd.productName,pro_pub.projectName ,pro_pub.updateInfo,pro_pub.updateTime,pro_pub.version,pro_pub.status ,pp.priority from xr_product as pd  INNER JOIN xr_product_project as pp on pd.id =pp.productId   INNER JOIN  xr_project_publish as pro_pub on pp.projectId=pro_pub.id ORDER BY pd.priority asc, pp.priority asc ,pro_pub.updateTime desc ) as b where a.projectName=b.projectName and a.updateTime<b.updateTime) ',
    insertProjectPublish:'INSERT INTO xr_project_publish(projectName,updateInfo,updateTime,status,version ) values (?,?,?,?,?)',
    insertProduct:"INSERT INTO xr_product (productName) VALUES(?)",
    insertProduct_project:"INSERT INTO xr_product_project (productId,projectId) VALUES(?,?)",
    queryProductByName:"select * from xr_product as xp WHERE xp.productName=?",
    queryProducts:"select xp.productName from xr_product as xp",
    queryProjectsByName:"select * from xr_project_publish xpp where xpp.id in( select xpd_pj.projectId from xr_product_project as xpd_pj WHERE xpd_pj.productId"+
                        " in (select xpd.id from xr_product as xpd WHERE xpd.productName=?) and xpd_pj.projectId in"+
                        "(select xpj.id from xr_project_publish as xpj WHERE xpj.projectName=?))",
    queryProductsMenu:"SELECT distinct  pd.productName,pro_pub.projectName FROM xr_product AS pd INNER JOIN xr_product_project AS pp ON pd.id = pp.productId INNER JOIN xr_project_publish AS pro_pub ON pp.projectId = pro_pub.id",
    updateProjectPublish:'UPDATE xr_project_publish as xpp set xpp.projectName=?,xpp.updateInfo=?,xpp.updateTime=?,xpp.`status`=?,xpp.version=? where id=?',
    deleteProjectPublish:'DELETE FROM xr_project_publish where id =?',
    queryAllProducts:"select * from xr_product",
    updateProductPrioirty:"update xr_product as xp set xp.priority=? where xp.id=?",
};
module.exports = project;