const express = require("express")
const app = express()
const apiRouter = require("./routes/api-router")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use("/api", apiRouter)

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