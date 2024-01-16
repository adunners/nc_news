const {fetchTopics, fetchApi, fetchArticleById} = require("../models/topics-model")

exports.getTopics = (req, res, next) => {
 fetchTopics().then((topics) => {
    res.status(200).send({topics})
 })
 .catch((err) => {
    next(err)
 })
}

exports.getApi = (req, res, next) => {
    fetchApi().then((endpoints) => {
        res.status(200).send({endpoints})
    }).catch((err) => {
    next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleById(id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        console.log(err, 'err')
        next(err)
    })
}