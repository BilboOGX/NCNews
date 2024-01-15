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
            //console.log(response.body.msg)
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
          //console.log(res.body)
          //console.log(res, '<<<')
          expect(res.body).toEqual(endpointsTest)
        })
      })
    })
   
  
