// 导入 express 模块
const express = require('express')

// 创建 express 的服务器实例
const app = express()



// 导入 cors 中间件
const cors = require('cors')

// 将 cors 注册为全局中间件   解决跨域问题
app.use(cors())

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))
// 响应数据的中间件
app.use((req, res, next)=>{
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function(err, status = 1){
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 导入并注册用户路由模块
const userRouter = require('./router/user')



app.use('/api', userRouter)
const Joi = require('joi')
app.use((err, req, res, next)=>{
    if(err instanceof Joi.ValidationError) return res.cc(err)
    res.cc(err)
})


// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件  解决数据转换问题
app.use(express.urlencoded({extended: false}))
















// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, ()=>{
    console.log('api server running at http://127.0.0.1:3007')
})