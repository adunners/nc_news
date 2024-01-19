const apiRouter = require("express").Router()
const topicsRouter = require("./topics-router")
const commentsRouter = require("./comments-router")
const userRouter = require("./user-router")
const articlesRouter = require("./articles-router")
const {getApi} = require("../controllers/controllers")

apiRouter.use("/topics", topicsRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/users", userRouter)
apiRouter.use("/articles", articlesRouter)

apiRouter.get("/", getApi)

module.exports = apiRouter