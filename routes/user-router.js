const userRouter = require("express").Router()
const {getUsers} = require("../controllers/controllers")


userRouter.get("/", getUsers)


module.exports = userRouter