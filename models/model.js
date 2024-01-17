const format = require("pg-format");
const db = require('../db/connection');
const topics = require("../db/data/test-data/topics");
const articles = require("../db/data/test-data/articles");
const comments = require('../db/data/test-data/comments')

exports.fetchTopics = () => {
    let query = 'SELECT * FROM topics'
    return db.query(query).then((rows) => {
        return rows.rows
    })
}

exports.getArticle = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'ARTICLE DOES NOT EXIST!'})
        }
        return res.rows[0]
    })
};

exports.sortArticles = (sort_by = 'created_at', order = 'desc') => {
    let query = `
        SELECT 
        articles.author, articles.title, articles.article_id, 
        articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS number_of_comments
        FROM articles
        LEFT JOIN comments on articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order}`
    return db.query(query).then((rows) => {
        // console.log(rows.rows)
        return rows.rows
    })
}

exports.sortComments = (article_id, sort_by = 'created_at', order = 'desc') => {
        let query = `
        SELECT
        comment_id, votes, created_at, author, body, article_id
        FROM comments 
        WHERE article_id = $1
        ORDER BY ${sort_by} ${order}`
            
        return db.query(query, [article_id]).then((rows) => {
            return rows.rows
        })
    }

