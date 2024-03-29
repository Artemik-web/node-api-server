const express = require('express')
const router = express.Router()
const article_handler = require('../router_handler/article')
const expressJoi = require('@escook/express-joi')
const {add_article_schema, delete_schema,get_articleById_schema,update_article_schema,get_article_schema,get_userarticle_schema} = require('../schema/article')

const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(__dirname, '../uploads')})

//根据搜索内容查询相关文章
router.get('/search/q=:q', article_handler.search)
//根据tips查询相关文章
router.get('/search/tips=:tips', article_handler.searchTips)

router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

//根据文章id查询文章内容  分类
router.post('/list', expressJoi(get_article_schema), article_handler.getArticle)
//用作者author_id查所有该作者所有文章
router.post('/userarticle',  expressJoi(get_userarticle_schema),  article_handler.getAllArticleById)
//根据ID删除文章的路由
router.post('/delete/:Id', expressJoi(delete_schema), article_handler.deleteById)
//根据Id查询文章
router.get(
	'/:Id',
	expressJoi(get_articleById_schema),
	article_handler.getArticleById
)
//更新文章内容
router.post(
	'/edit',
	upload.single('cover_img'),
	expressJoi(update_article_schema),
	article_handler.editArticle
)




module.exports = router