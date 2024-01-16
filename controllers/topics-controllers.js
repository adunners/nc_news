const {fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleIdComments} = require("../models/topics-model")

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
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
    next(err)
    })
}

exports.getArticleIdComments = (req, res, next) => {
    const id = req.params.article_id
    const fetchQuery = fetchArticleIdComments(id)
    const idExistenceQuery = fetchArticleById(id)

    Promise.all([fetchQuery, idExistenceQuery])

    .then((comments) => {
        res.status(200).send({comments: comments[0]})
    })
    .catch((err) => {
        next(err)
    })
}