/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 为了保证密码的安全性，不建议在数据库以 明文 的形式保存用户密码，推荐对密码进行 加密存储
// 导入 bcryptjs  加密
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册用户的处理函数
exports.reguser = (req, res)=> {

    //获取客户端提交到服务器的用户信息
    // 接收表单数据
    const userInfo = req.body
    // 判断数据是否合法
    // if( !userInfo.username || !userInfo.password){
    //     return res.send({ status: 1, message: '用户名或密码不合法！'})
    // }


    //定义sql语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'

    db.query(sqlStr, [userInfo.username], (err, result)=>{
        // 执行 SQL 语句失败
        if(err){

            // return res.send({status: 1, message: err.message})
            return res.cc(err)

        }
        // 用户名被占用
        if(result.length > 0){

            // return res.send({status: 1, message: '用户名被占用，请更换其他用户名！'})
            return res.cc('用户名被占用，请更换其他用户名')

        }  

        // TODO: 用户名可用，继续后续流程...

        // 在注册用户的处理函数中，确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句，插入新用户
        db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, result)=>{
            // 执行 SQL 语句失败
            // if(err) return res.send({status: 1, message: err.message})
            if(err) return res.cc(err)
            // SQL 语句执行成功，但影响行数不为 1
            // if(result.affectedRows !== 1) return res.send({status: 1, message: '注册用户失败，请稍后重试！'})
            if(result.affectedRows !== 1) return res.cc('注册用户失败，请稍后重试！')
            // 注册成功
            res.send({status: 0, message: '注册用户成功！'})
        })

    })




    // res.send('reguser ok')
}


// 登录的处理函数
exports.login = (req, res)=> {
    const userInfo = req.body
    const sql = `select * from ev_users where username=?`
    db.query(sql, userInfo.username, (err, results)=> {
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if(results.length !== 1) return res.cc('当前用户未注册！')
        // 判断用户输入的登录密码是否和数据库中的密码一致
        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)//返回布尔值
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if(!compareResult) return res.cc('密码错误！')
        // 生成 JWT 的 Token 字符串
        // 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: ''}
        // 对用户的信息进行加密生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecrekry, { expiresIn: config.expiresIn})
        // console.log(tokenStr)
        res.send({
            status: 0,
            message: '登陆成功！',
             // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer+空格 的前缀
            token: 'Bearer ' + tokenStr
        })
    })
    
}