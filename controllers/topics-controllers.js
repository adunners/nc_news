const {fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleIdComments, addCommentToArticleId,  addVotesToArticlesId} = require("../models/topics-model")

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

exports.postCommentToArticleId = (req, res, next) => {
    const {article_id: id} = req.params
    const {body, username} = req.body
    addCommentToArticleId(id, body, username).then((addedComment) => {
        res.status(201).send({addedComment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.updateVotesToArticlesId = (req, res, next) => {
    const {article_id: id} = req.params
    const {inc_votes: votes} = req.body
    addVotesToArticlesId(id, votes).then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}