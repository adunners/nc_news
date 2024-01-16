const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");
const fs = require("fs/promises");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("GET tests", () => {
    describe("/api/topics", () => {
      test("GET 200: should respond with an array of topic objects, each should have a description and slug property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
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
    describe("/api/", () =>
      test("GET 200: should return with an object describing all the other available endpoints on /api/", () => {
        return fs
          .readFile(
            `${__dirname}/../endpoints.json`,
            "utf-8"
          )
          .then((endpoints) => {
            return request(app)
              .get("/api/")
              .expect(200)
              .then(({ body }) => {
                expect(body.endpoints).toEqual(JSON.parse(endpoints));
              });
          });
      }));
    describe("/api/articles/:article_id", () => {
      test("GET 200: should return with an article object with all the correct properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toEqual({
             article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("GET 400: should return with an error message if given an invalid request", () => {
        return request(app)
        .get("/api/articles/invalid-request")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
      })
      test("GET 404: should return with an error message if given an valid request which doesn't exist", () => {
        return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
      })
    });
  });
});
