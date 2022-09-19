// 新建 router 文件夹，用来存放所有的路由模块



const express = require('express')
// 创建路由对象
const router = express.Router()
const userHandler = require('../router_handler/user')

// 注册新用户
router.post('/reguser', userHandler.reguser)

// 登录
router.post('/login', userHandler.login)

module.exports = router