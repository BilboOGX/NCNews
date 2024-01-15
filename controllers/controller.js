const { fetchTopics } = require('../models/model')
const topics = require('../db/data/test-data/topics')
const endpoints = require('../endpoints.json')

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