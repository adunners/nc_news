const commentsRouter = require("express").Router()
const {getComments, deleteCommentById} = require("../controllers/controllers")


commentsRouter
.route("/")
.get(getComments)

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)


module.exports = commentsRouter