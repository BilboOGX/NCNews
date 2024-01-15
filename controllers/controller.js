const { fetchTopics } = require('../models/model')
const topics = require('../db/data/test-data/topics')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
    res.status(200).send(topics)    
    })
    .catch((err) => {
        next(err)
    }) 
}