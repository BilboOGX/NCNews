const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controller')

app.use(express.json());

app.get('/api/topics', getTopics)

app.all('/*', (req, res) => {res.status(404).send({msg: 'URL not found'})})

app.use((err, req, res, next) => {
    
})

module.exports = app;