const format = require("pg-format");
const db = require('../db/connection');
const topics = require("../db/data/test-data/topics");

exports.fetchTopics = () => {
    let query = 'SELECT * FROM topics'
    return db.query(query).then((rows) => {
        return rows.rows
    })
}

exports.getArticle = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'ARTICLE DOES NOT EXIST!'})
        }
        return res.rows[0]
    })
};