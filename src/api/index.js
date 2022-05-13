import service from "@/utils/ajax";
import serviceAmap from "@/utils/ajaxAmap";

// 用户登录的接口
export const userLogin = (data) => service({url: '/login', method: 'POST', data})
// 请求用户地址接口
export const getUserAddress = () => serviceAmap({url: '/ip', method: 'GET', params: {key:'fcbc166eba09f0f09e9439fabb768ffe'}})
// 请求天气的地址
export const getWeather = (adcode) => serviceAmap({
    url: `/weather/weatherInfo`,
    method: 'GET',
    params:{
        city:adcode,
        key: 'fcbc166eba09f0f09e9439fabb768ffe'
    }
})
// 获取分类列表的接口
export const reqCategoryList = (parentId) => service({url: '/manage/category/list', method: "GET", params: {parentId}})
// 添加分类的接口
export const reqAddCategory = (parentId, categoryName) => service({
    url: '/manage/category/add',
    method: 'POST',
    data: {parentId, categoryName}
})
// 修改分类的接口
export const reqUpdateCategory = (categoryId, categoryName) => service({
    url: '/manage/category/update',
    method: 'POST',
    data: {categoryId, categoryName}
})
// 通过id获取分类的接口
export const reqCategory = (categoryId) => service({url: '/manage/category/info', method: 'GET', params: {categoryId}})
// 获取商品列表
export const reqProductList = (pageNum, pageSize) => service({
    url: '/manage/product/list',
    method: 'GET',
    params: {pageNum, pageSize}
})
// 获取搜索的商品列表
export const reqSearchProductList = (params) => service({url: '/manage/product/search', method: 'GET', params})
// 更新商品的状态
export const reqUpdateStatus = (productId, status) => service({url: '/manage/product/updateStatus', method: 'POST', data: {productId, status}})
// 新增商品
export const reqAddProduct = (data) => service({url: '/manage/product/add', method: 'POST', data})
// 更新商品
export const reqUpdateProduct = (data) => service({url: '/manage/product/update', method: 'POST', data})
// 获取角色列表
export const reqRoleList = () => service({url: '/manage/role/list', method: 'GET'})
// 新增角色
export const reqAddRole = (data) => service({url: '/manage/role/add', method: 'POST', data})
// 更改角色权限
export const reqUpdateRole = (data) => service({url: '/manage/role/update', method: 'POST', data})
// 获取用户列表
export const reqGetUsers = () => service({url: '/manage/user/list', method: 'GET'});
// 删除用户
export const reqDeleteUser = (userId) => service({url: '/manage/user/delete', method: 'POST', data: {userId}});
// 添加用户
export const reqAddUser = (data) => service({url: '/manage/user/add', method: 'POST', data});
// 更新用户
export const reqUpdateUser = (data) => service({url: '/manage/user/update', method: 'POST', data});