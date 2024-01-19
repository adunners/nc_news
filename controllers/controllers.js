const {fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleIdComments, addCommentToArticleId,  addVotesToArticlesId, fetchComments, removeCommentById, fetchUsers} = require("../models/model")

const{checkTopicExists} = require("../utility-controller")

//GET
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
    const {topic} = req.query

    const topicCheckQuery = checkTopicExists(topic)
    const returnArticlesQuery = fetchArticles(topic)
    
    Promise.all([returnArticlesQuery, topicCheckQuery])

    .then((response) => {
        const articles = response[0]
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

exports.getComments = (req, res, next) => {
    fetchComments().then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    }).catch((err) => {
        next(err)
    })
}

//POST
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


//PATCH
exports.updateVotesToArticlesId = (req, res, next) => {
    const {article_id: id} = req.params
    const {inc_votes: votes} = req.body
    addVotesToArticlesId(id, votes).then((updatedArticle) => {
        res.status(200).send({article: updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}

// DELETE
exports.deleteCommentById = (req, res, next) => {
    const{comment_id} = req.params
    removeCommentById(comment_id).then((deletedComment) => {
        res.status(204).send({comments: deletedComment})
    }).catch((err) => {
        next(err)
    })
} 