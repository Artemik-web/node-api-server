/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 为了保证密码的安全性，不建议在数据库以 明文 的形式保存用户密码，推荐对密码进行 加密存储
// 导入 bcryptjs  加密
const bcrypt = require('bcryptjs')

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
    res.send('login ok')
}