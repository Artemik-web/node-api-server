const db = require('../db')

exports.addArticle = (req, res)=> {
    // console.log(req.body) // 文本类型的数据
    // console.log('--------分割线----------')
    // console.log(req.file) // 文件类型的数据
    if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')


    const path = require('path')
    const articleInfo = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id

    }
    const sql = `insert into ev_articles set ?`
    db.query(sql, articleInfo, (err, results)=> {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('文章发布失败！')
        res.cc('文章发布成功！', 0)
    })
    
}

exports.getArticle = (req, res)=>{
    const sql = 'select * from ev_articles where is_delete=0 order by id asc'
    db.query(sql, (err, results)=>{
        if(err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章列表成功',
            data: results
        })
    })
}   

exports.deleteById = (req, res)=>{
    const sql = 'update ev_articles set is_delete=1 where Id=?'

    db.query(sql, req.params.Id, (err, result)=>{
        if(err) return res.cc(err)
        if(result.affectedRows !== 1)return res.cc('删除文章失败')

        res.cc('删除文章成功', 0)
    })

}

exports.getArticleById = (req, res)=>{
    const sql = 'select * from ev_articles where Id=?'

    db.query(sql, req.params.Id, (err, results)=>{
        // 执行 SQL 语句失败
		if (err) return res.cc(err)

		// SQL 语句执行成功，但是没有查询到任何数据
		if (results.length !== 1) return res.cc('获取文章数据失败！')

		// 把数据响应给客户端
		res.send({
			success: true,
			status: 0,
			message: '获取文章数据成功！',
			data: results[0],
		})
    })
}


//更新文章的处理函数
exports.editArticle = (req, res) => {
    const sqlStr = 'select * from ev_articles where Id != ? and title = ?'
    db.query(sqlStr, [req.body.Id, req.body.title], (err, results)=>{
        if(err) return res.cc(err)
        if(results[0]){
            return res.cc('文章标题不能重复')
        }
        if (!req.file || req.file.fieldname !== 'cover_img')
			return res.cc('文章封面是必选参数！')
		// 证明数据都是合法的，可以进行后续业务逻辑的处理
		// 处理文章的信息对象
        const path = require('path')
        const articleInfo = {
			// 标题、内容、发布状态、所属分类的Id
			...req.body,
			// 文章封面的存放路径
			cover_img: path.join('/uploads', req.file.filename),
			// 文章的发布时间
			pub_date: new Date(),
			// 文章作者的Id
			author_id: req.user.id,
		}
		const sql = `update ev_articles set ? where Id=?`
		db.query(sql, [articleInfo, req.body.Id], (err, results) => {
			if (err) return res.cc(err)
			if (results.affectedRows !== 1) return res.cc('编辑文章失败！')
			res.cc('编辑文章成功！', 0)
		})
    })
}