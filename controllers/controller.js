const { fetchTopics, getArticle, sortArticles, sortComments, addCommentBody, incVotes, removeComment, fetchUsers} = require('../models/model')
const {checkArticleExists} = require('../db/seeds/utils')
const topics = require('../db/data/test-data/topics')
const endpoints = require('../endpoints.json')
const articles = require('../db/data/test-data/articles')
const comments = require('../db/data/test-data/comments')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
    res.status(200).send(topics)    
    })
    .catch((err) => {
        next(err)
    }) 
}

exports.getEndPoints = (req, res, next) => {
    res.status(200).send(endpoints)
}

exports.getArticleID = (req, res, next) => {
    const { article_id } = req.params;
    
    getArticle(article_id)
    .then((article) => {
    res.status(200).send({article});
    })
    .catch((err) => {
        next(err)
    })
}

exports.articleCommentCount = (req, res, next) => {
    const { article_id } = req.params
    const { sort_by } = req.query
    const { order } = req.query

    sortArticles(article_id, sort_by, order)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    const { sort_by } = req.query
    const { order } = req.query

   
    const func1 = checkArticleExists(article_id)
    const func2 = sortComments(article_id, sort_by, order)
    Promise.all([func1, func2]).then((comments) => {
        res.status(200).send(comments[1])
    })
    .catch((err) => {
        next(err)
    })
    }

exports.addComment = (req, res, next) => {
    const { article_id } = req.params
    const comment = req.body
    

    addCommentBody(article_id, comment)
    .then((comment) => {
        res.status(201).send(comment.body)
    })
    .catch((err) => {
        next(err)
    })
}

exports.updateVotes = (req, res, next) => {
    const { article_id } = req.params
    const incAmount = req.body

    incVotes(article_id, incAmount)
    .then((article) => {
    res.status(200).send(article);
    })
    .catch((err) => {
        next(err)
    })

}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params

    removeComment(comment_id)
    .then((comment) => {
        res.status(204).send(comment);
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((user) => {
        res.status(200).send(user)    
        })
        .catch((err) => {
            next(err)
        }) 

}
