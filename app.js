// 导入 express 模块
const express = require('express')

// 创建 express 的服务器实例
const app = express()
//解决报错文件转base64后太长，设置文件10M限制     数据库TEXT格式无法存储格式在数据库内已更改为longtext
let bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

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



const expressJWT = require('express-jwt')
const config = require('./config')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证 secret指定密钥
app.use(expressJWT({secret: config.jwtSecrekry}).unless({path: [/^\/api/]}))


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)
//导入并使用文章分类管理的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

const Joi = require('joi')
app.use((err, req, res, next)=>{
    if(err instanceof Joi.ValidationError) return res.cc(err)

    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    res.cc(err)
})
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件  解决数据转换问题
app.use(express.urlencoded({extended: false}))
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
















// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, ()=>{
    console.log('api server running at http://127.0.0.1:3007')
})