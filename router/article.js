const express = require('express')
const router = express.Router()
const article_handler = require('../router_handler/article')
const expressJoi = require('@escook/express-joi')
const {add_article_schema, delete_schema,get_articleById_schema,update_article_schema,get_article_schema} = require('../schema/article')

const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(__dirname, '../uploads')})

router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
router.get('/list/:cate_id', expressJoi(get_article_schema), article_handler.getArticle)
//根据ID删除文章的路由
router.post('/delete/:Id', expressJoi(delete_schema), article_handler.deleteById)
//根据Id查询文章
router.get(
	'/:Id',
	expressJoi(get_articleById_schema),
	article_handler.getArticleById
)
router.post(
	'/edit',
	upload.single('cover_img'),
	expressJoi(update_article_schema),
	article_handler.editArticle
)




module.exports = router