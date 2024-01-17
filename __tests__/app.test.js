const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endpointsTest = require('../endpoints.json')

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("GET api/topics", () => {
  test("GET /api/topics should return status code 200", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
  });
  test('404 error when incorrect URL is used and message URL not found', () =>{
    return request(app)
    .get('/api/topicss')
    .expect(404).then((response) => {
      expect(response.body.msg).toBe('URL not found');
    });
  })
  test('Array of correct data is returned', () =>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((res) => {
      res.body.forEach((topic) => {
        expect(typeof topic.description).toBe("string");
        expect(typeof topic.slug).toBe("string");
      })
    })
  })
});

describe('/api', () => {
  test('provides an object with a description of all available endpoints', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then((res) => {
      expect(res.body).toEqual(endpointsTest)
    })
  })
})
  
describe('/api/articles/:article_id', () => {
  test('GET article_id returns an article object with the matching id and properties and a status code 200', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((res) => {
      expect(res.body.article.body).toBe("I find this existence challenging")
      expect(res.body.article.topic).toBe("mitch")
      expect(res.body.article.votes).toBe(100)
      expect(res.body.article.author).toBe("butter_bridge")
      expect(res.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
      expect(res.body.article.article_id).toBe(1)
    })
  })
  test('GET returns 404 and ARTICLE DOES NOT EXIST! when a valid but non existent article id is inserted', () => {
    return request(app)
    .get('/api/articles/1990')
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('ARTICLE DOES NOT EXIST!')
    })
  })
  test('GET returns 400 and error message when an invalid id type is inserted', () => {
    return request(app)
    .get('/api/articles/invalid')
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('INVALID INPUT')
    })
  })
})

describe('/GET /api/articles', () => {
  test('GET /api/articles to respond with an array of article objects with the correct properties and NOT a body property', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((article) => {
        expect(article.body).hasOwnProperty('author');
        expect(article.body).hasOwnProperty('title');
        expect(article.body).hasOwnProperty('article_id');
        expect(article.body).hasOwnProperty('topic');
        expect(article.body).hasOwnProperty('created_at');
        expect(article.body).hasOwnProperty('votes');
        expect(article.body).hasOwnProperty('article_img_url');
        expect(article.body).not.hasOwnProperty('body')
      })
    })
  })
  test('GET /api/articles to respond true when the properties are sorted by date in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      expect(res.body).toBeSortedBy('created_at', {descending: true})
    })
  })
  test('GET /api/articles to respond true when the properties are sorted by date in descending order and tested against ascending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      expect(res.body).not.toBeSortedBy('created_at', {ascending: true})
    })
  })
  test('404 error when incorrect URL is used and message URL not found', () =>{
    return request(app)
    .get('/api/articless')
    .expect(404).then((response) => {
      expect(response.body.msg).toBe('URL not found');
    });
  })
  test('GET /api/articles to respond with an object containing a property with the total number of comments', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((article) => {
        expect(article.body).hasOwnProperty('author');
        expect(article.body).hasOwnProperty('title');
        expect(article.body).hasOwnProperty('article_id');
        expect(article.body).hasOwnProperty('topic');
        expect(article.body).hasOwnProperty('created_at');
        expect(article.body).hasOwnProperty('votes');
        expect(article.body).hasOwnProperty('article_img_url');
        expect(article.body).not.hasOwnProperty('body')
        expect(article.body).hasOwnProperty('number_of_comments')
        console.log(article.number_of_comments)
        expect(typeof article.number_of_comments).toBe('string')
      })
    })
  })
})
