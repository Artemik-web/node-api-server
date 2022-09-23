const db = require('../db')

exports.addArticle = (req, res)=> {
    // console.log(req.body) // 文本类型的数据
    // console.log('--------分割线----------')
    // console.log(req.file) // 文件类型的数据
    if(!req.file || req.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')


    const path = require('path')
    const articleInfo = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        pub_date: newDate(),
        author_id: req.user.id

    }
    const sql = `insert into ev_article set ?`
    db.query(sql, articleInfo, (err, results)=> {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('文章发布失败！')
        res.send('文章发布成功！', 0)
    })
    
}