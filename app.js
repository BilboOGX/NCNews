const express = require("express");
const app = express();
const { getTopics, getEndPoints, getArticleID, articleCommentCount } = require('./controllers/controller')

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', getEndPoints)

app.get('/api/articles/:article_id', getArticleID)

app.get('/api/articles', articleCommentCount)

app.all('*', (req, res) => {res.status(404).send({msg: 'URL not found'})})

app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg:'INVALID INPUT'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})





module.exports = app;