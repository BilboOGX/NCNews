const express = require("express");
const app = express();
const { getTopics, getEndPoints, getArticleID, articleCommentCount, getArticleComments, addComment} = require('./controllers/controller')

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', getEndPoints)

app.get('/api/articles/:article_id', getArticleID)

app.get('/api/articles', articleCommentCount)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', addComment)

app.all('*', (req, res) => {res.status(404).send({msg: 'URL not found'})})

app.use((err, req, res, next) => {

    if (err.code === '22P02'){
        res.status(400).send({msg:'INVALID INPUT'})
    } else if (err.code === '23503' && err.detail.includes('Key (article_id)')){
        res.status(404).send({msg: 'ARTICLE DOES NOT EXIST!'})
    } else if (err.code === '23503'){
        res.status(404).send({msg:'NO USER-ID FOUND'})
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