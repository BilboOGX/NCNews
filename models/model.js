const format = require("pg-format");
const db = require('../db/connection');
const topics = require("../db/data/test-data/topics");

exports.fetchTopics = () => {
    let fetch = 'SELECT * FROM topics'
    return db.query(fetch).then((rows) => {
        return rows.rows
    })
}