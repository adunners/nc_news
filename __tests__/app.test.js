const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");
const fs = require('fs/promises')
// const endpoints = fs.readFile("/home/alex/northcoders/backend/project/be-nc-news/endpoints.json", "utf-8").then((endpoints) => {return JSON.parse(endpoints)})



beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("GET tests", () => {
    describe("/api/topics", () => {
      test("GET 200: should respond with an array of topic objects, each should have a description and slug property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({body}) => {
            expect(body.topics.length).toBe(3);
            body.topics.forEach((topic) => {
              expect(typeof topic.description).toBe("string");
              expect(typeof topic.slug).toBe("string");
            });
          });
      });
    });
    describe("/api/*", () => {
      test("GET 404: should return with an error if the file path given does not exist", () => {
        return request(app)
          .get("/api/invalid-path")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Not Found - path does not exist");
          });
      });
    });
    describe("/api/", () => (
        test("GET 200: should return with an object describing all the other available endpoints on /api/", () => {
            return fs.readFile("/home/alex/northcoders/backend/project/be-nc-news/endpoints.json",
            "utf-8")
            .then((endpoints) => {
                return request(app)
                .get("/api/")
                .expect(200)
                .then(({body}) => {
                 expect(body.endpoints).toEqual(JSON.parse(endpoints))   
                })
            })
        })
    ))
  });
});
