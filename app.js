const express = require("express")
const app = express()
const {getTopics, getApi, getArticleById, getArticles, getArticleIdComments, postCommentToArticleId, updateVotesToArticlesId, getComments, deleteCommentById, getUsers} = require("./controllers/controllers")

app.use(express.json())

//GET
app.get("/api/topics", getTopics)

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleIdComments)

app.get("/api/comments", getComments)

app.get("/api/users", getUsers)

//POST
app.post("/api/articles/:article_id/comments/", postCommentToArticleId)


//PATCH
app.patch("/api/articles/:article_id", updateVotesToArticlesId)

//DELETE
app.delete("/api/comments/:comment_id", deleteCommentById)

//ALL
app.all("/api/*", (req, res, next) => {
    res.status(404).send({msg: "Not Found - path does not exist"})
})


//error handling middleware
app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else(next(err))
})

app.use((err, req, res, next) => {
    if(err.code = "22P02"){
        res.status(400).send({msg: "Bad Request"})
    }
    else{next(err)}
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "Internal Server Error"})
})


module.exports = app