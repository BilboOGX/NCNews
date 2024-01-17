const { fetchTopics, getArticle, sortArticles } = require('../models/model')
const topics = require('../db/data/test-data/topics')
const endpoints = require('../endpoints.json')
const articles = require('../db/data/test-data/articles')

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
    const { sort_by } = req.query
    const { order } = req.query

    sortArticles(sort_by, order)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
 
}

