// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()
const Id = joi.number().integer().min(1).required()
const author_id = joi.number().integer().min(1).required()
// 验证规则对象 - 发布文章
exports.add_article_schema = {
	body: {
		title,
		cate_id,
		content,
		state,
	},
}

exports.get_article_schema = {
	params: {
		cate_id,
	},
}
// 根据authorid即用户id获取该用户写的所有文章
exports.get_userarticle_schema = {
	// 表示需要对 req.body 中的数据进行验证
	body: {
		author_id,
	},
}
exports.delete_schema = {
	params: {
		Id,
	}
}


// 校验规则对象 - 根据 id 获取文章
exports.get_articleById_schema = {
	params: {
		Id,
	},
}


// 校验规则对象 — 更新文章
exports.update_article_schema = {
	body: {
		Id,
		title,
		cate_id,
		content,
		state,
	},
}