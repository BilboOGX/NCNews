const express = require("express");
const app = express();
const cors = require('cors');
const { getTopics, getEndPoints, getArticleID, articleCommentCount, getArticleComments, addComment, updateVotes, deleteComment, getUsers} = require('./controllers/controller')

app.use(express.json());
app.use(cors());

app.get('/api/topics', getTopics)

app.get('/api', getEndPoints)

app.get('/api/articles/:article_id', getArticleID)

app.get('/api/articles', articleCommentCount)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', addComment)

app.patch('/api/articles/:article_id', updateVotes) 

app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', (req, res) => {res.status(404).send({msg: 'URL NOT FOUND'})})

app.use((err, req, res, next) => {

    if (err.code === '22P02' || err.code === '42883' || err.code === '42703'){
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