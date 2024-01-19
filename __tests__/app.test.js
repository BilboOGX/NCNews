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
      expect(response.body.msg).toBe('URL NOT FOUND');
    });
  })
  test('Array of correct data is returned', () =>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((res) => {
      res.body.forEach((topic) => {
        expect(res.body.length > 0).toBe(true)
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
      console.log(res.body)
      res.body.forEach((article) => {
        expect(res.body.length > 0).toBe(true)
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
      expect(response.body.msg).toBe('URL NOT FOUND');
    });
  })
  test('GET /api/articles to respond with an object containing a property with the total number of comments', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      expect(Array.isArray(res.body)).toBe(true)
      res.body.forEach((article) => {
        expect(res.body.length > 0).toBe(true)
        expect(article.body).hasOwnProperty('author');
        expect(article.body).hasOwnProperty('title');
        expect(article.body).hasOwnProperty('article_id');
        expect(article.body).hasOwnProperty('topic');
        expect(article.body).hasOwnProperty('created_at');
        expect(article.body).hasOwnProperty('votes');
        expect(article.body).hasOwnProperty('article_img_url');
        expect(article.body).not.hasOwnProperty('body')
        expect(article.body).hasOwnProperty('number_of_comments')
        expect(typeof article.number_of_comments).toBe('string')
      })
    })
  })
})

describe('/api/articles/:article_id/comments', () => {
  test('GET /api/articles/:article_id/comments responds with an array of comments for the given article_id ', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((res) => {
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).not.toBe(0)
      res.body.forEach((comments) => {
        expect(res.body.length > 0).toBe(true)
        expect(comments.body).hasOwnProperty('comment_id');
        expect(comments.body).hasOwnProperty('votes');
        expect(comments.body).hasOwnProperty('created_at');
        expect(comments.body).hasOwnProperty('author');
        expect(comments.body).hasOwnProperty('body');
        expect(comments.body).hasOwnProperty('article_id');
      })
    })
  })
  test('GET /api/articles/:article_id/comments responds with an empty array if no comments', () => {
    return request(app)
    .get('/api/articles/4/comments')
    .expect(200)
    .then((res) => {
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBe(0)
    })
  })
  test('GET /api/articles/:article_id/comments responds with a 404 when no article is found', () => {
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404).then((response) => {
        expect(response.body.msg).toBe('ARTICLE DOES NOT EXIST!');
      });
    })
    test('GET /api/articles/:article_id/comments returns 400 and error message when an invalid id type is inserted', () => {
      return request(app)
      .get('/api/articles/invalid/comments')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('INVALID INPUT')
      })
    })
  })

  describe('POST /api/articles/:article_id/comments', () => {
    test('POST /api/articles/:article_id/comments returns an 201 status code ', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({username: 'butter_bridge', body: 'Hello There!'})
      .expect(201)
    })
    test('POST /api/articles/:article_id/comments returns the posted comment', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({username: 'butter_bridge', body: 'Hello There!'})
      .expect(201)
      .then((res) => {
        expect(res.text).toBe('Hello There!')
      })
    })
    test('POST /api/articles/:article_id/comments returns a 404 error if an incorrect username is used', () => {
      return request(app)
      .post('/api/articles/1/comments')
      .send({username: 'not_butter_bridge', body: 'Hello There!'})
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('NO USER-ID FOUND')
      })
    })
    test('POST /api/articles/:article_id/comments returns a 404 error if article doesnt exist', () => {
      return request(app)
      .post('/api/articles/999/comments')
      .send({username: 'butter_bridge', body: 'Hello There!'})
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('ARTICLE DOES NOT EXIST!')
      })
    })
  })

  describe('PATCH /api/articles/:article_id', () => {
    test('PATCH /api/articles/:article_id returns a 200 status code ', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1})
      .expect(200)
    })
    test('PATCH /api/articles/:article_id returns the article object with an updated votes key when a positive int is used', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1})
      .expect(200)
      .then((res) => {
        expect(res.body).hasOwnProperty('votes')
        expect(res.body.votes).toBe(101)
        expect(res.body.article_id).toBe(1)
      })
    })
    test('PATCH /api/articles/:article_id returns the article object with an updated votes key when a negative int is used', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -1})
      .expect(200)
      .then((res) => {
        expect(res.body).hasOwnProperty('votes')
        expect(res.body.votes).toBe(99)
      })
    })
    test('PATCH /api/articles/:article_id returns 404 when no article is found', () => {
      return request(app)
      .patch('/api/articles/999')
      .send({ inc_votes: -1})
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('ARTICLE DOES NOT EXIST!')
      })
    })
    test('PATCH /api/articles/:article_id returns 400 when invalid data type used', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: false})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('INVALID INPUT')
      })
    })
  })

  describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE /api/comments/:comment_id returns a 204 status code ', () => {
      return request(app)
      .delete('/api/comments/1')
      .expect(204)
    })
    test('Returns 404 when comment doesnt exist', () => {
      return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('COMMENT DOES NOT EXIST!')
      })
    })
    test('Returns 400 when invalid data type used', () => {
      return request(app)
      .delete('/api/comments/test')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('INVALID INPUT')
      })
    })
    test('Returns 404 when incorrect url used', () => {
      return request(app)
      .delete('/api/cCComments/1')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('URL NOT FOUND')
      })
    })
  })

  describe("GET api/users", () => {
    test("GET /api/users should return status code 200", () => {
      return request(app)
      .get("/api/users")
      .expect(200)
    });
    test('404 error when incorrect URL is used and message URL not found', () =>{
      return request(app)
      .get('/api/userss')
      .expect(404).then((response) => {
        expect(response.body.msg).toBe('URL NOT FOUND');
      });
    })
    test('Array of correct data is returned', () =>{
      return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        res.body.forEach((user) => {
          expect(res.body.length > 0).toBe(true)
          expect(user).hasOwnProperty("username");
          expect(user).hasOwnProperty("name");
          expect(user).hasOwnProperty("avatar_url");
        })
      })
    })
  });

  describe('GET /api/articles (topic query)', () => {
    test('Returns an array of article objects with only the topics of mitch',() => {
      return request(app)
      .get('/api/articles/?topic=mitch')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(12)
        res.body.forEach((article) => {
          expect(res.body.length > 0).toBe(true)
          expect(article.topic).toBe('mitch');
        })
      })
      })
    test('returns an array of article objects with all topics included when no query is used', () => {
      return request(app)
      .get('/api/articles/')
      .expect(200)
      .then((res) => {
        res.body.forEach((user) => {
          expect(res.body.length > 0).toBe(true)
          expect(user.topic).toMatch(/mitch|cats/) 
        })
      })  
    })
    test('returns an empty array when a valid topic is used but the topic isnt found on any article', () => {
      return request(app)
      .get('/api/articles/?topic=paper')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(0)

      })
    })
    test('returns an 400 when an invalid topic is used', () => {
      return request(app)
      .get('/api/articles/?topic=dogs')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('NOT A VALID TOPIC!')
    })
  })
})

describe('/api/articles/:article_id (comment count)', () => {
  test('GET article_id returns an article object with the matching id and properties and a comment count property', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((res) => {
      console.log(res.body)
      expect(res.body.article).hasOwnProperty('number_of_comments')
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
    .get('/api/articles/2000')
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