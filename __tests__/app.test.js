const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");

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
  });
});
