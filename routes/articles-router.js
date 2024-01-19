const articlesRouter = require("express").Router()
const{getArticles, getArticleById, getArticleIdComments, postCommentToArticleId, updateVotesToArticlesId} = require("../controllers/controllers")

articlesRouter
.route("/")
.get(getArticles)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(updateVotesToArticlesId)

articlesRouter
.route("/:article_id/comments")
.get(getArticleIdComments)
.post(postCommentToArticleId)


module.exports = articlesRouter