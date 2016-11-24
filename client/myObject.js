/**
 * Created by Administrator on 2016/10/25.
 */
import Signal from 'signals';
const myObject = {
    started: new Signal(),
    modelColse:new Signal(),//对话框关闭 切回详情展示而不是编辑
    newRequireClose:new Signal(),//新建需求关闭  为了重置表单
    modelToInfo:new Signal(),//对话框切换为详情展示 重置编辑表单
    modelToEdit:new Signal(),//对话框切换为编辑时 设置 子任务 state
    modelShow:new Signal(), //对话框展示时 获取当前所在项目的版本号
    tableChange:new Signal(), //更新表格
    clickSubDetail:new Signal(), //对话框点击查看子任务详情
    backSupDetail:new Signal(), //返回父需求 切换为详情
    addSubTask:new Signal(), //新建子任务按钮 设置 DetailModal state ifEdit
    addNewRequire:new Signal(), //AddButton 模态框确认按钮触发 NewRequireForm 提交方法
    sessionUser:new Signal(), //登录成功后 发送用户信息
    UserLogout:new Signal(), //用户登出
    sendDetermine:new Signal(), //表格生成时 向TableAction发送 归类列表
    sessionStorageChange:new Signal(), //App组件 sessionStorageChange改变事件
    filterByTitle:new Signal(),  //更加title搜索
    filterByIntroducer:new Signal(),  //更加title搜索
    filterByChargeperson:new Signal(),  //更加title搜索
    tableDataResert:new Signal(), //
    CollapseToShrink:new Signal(), //编辑 需求用例 保存后收缩手风琴
    ShowDetailModal:new Signal(), //传入 require数据 展示 详情对话框
    ShowRelevanceModal:new Signal(), //显示关联对话框
    DetailsSaved:new Signal(), //需求详情保存 获取内容并跟新
    ExportSelectSend:new Signal(), //获取选择用例 ExportSelect 的value
    ExportSelectAccept:new Signal(),
    /***********/
    menu:new Signal(),
    menu1:new Signal(),
    ajaxSubmit:new Signal(),
    initProductModal:new Signal(),//初始化弹框
    productPriority:new Signal(),//初始化页面排版项目优先级
    initProductPriorityModal:new Signal(),
    priorityCloseModal:new Signal(),
	initProductPriorityModa2:new Signal(),

}
export default myObject;