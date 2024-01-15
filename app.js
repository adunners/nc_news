const express = require("express")
const app = express()
const {getTopics} = require("./controllers/topics-controllers")


app.get("/api/topics", getTopics)

app.all("/api/*", (req, res, next) => {
    res.status(404).send({msg: "Not Found - path does not exist"})
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "Internal Server Error"})
})


module.exports = app