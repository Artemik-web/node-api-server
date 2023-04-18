// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { get_userinfo_schema, update_userinfo_schema, update_password_schema } = require('../schema/user')

const { update_avatar_schema } = require('../schema/user')

// 登陆时获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 其他用户文章详情页获取作者的基本信息
router.post('/userinfo', expressJoi(get_userinfo_schema), userinfo_handler.getUserInfoById)
// 更新用户的基本信息
router.post('/updateuser', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 重置密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
// 更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
// 向外共享路由对象
module.exports = router