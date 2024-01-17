const { fetchTopics, getArticle, sortArticles, sortComments} = require('../models/model')
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
