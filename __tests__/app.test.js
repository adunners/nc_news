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
            expect(body.article).toMatchObject({
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
    describe("/api/articles", () => {
      test("GET 200: should return with an array of all the articles, with each element being an article object. The article object should include all the properties from the test data with an additional property comment_count (sum of all the comments)", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
          expect(body.articles.length).toBe(13)
          expect(body.articles).toBeSortedBy("created_at", {descending: true})
          body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string")
          expect(typeof article.title).toBe("string")
          expect(typeof article.article_id).toBe("number")
          expect(typeof article.topic).toBe("string")
          expect(typeof article.created_at).toBe("string")
          expect(typeof article.votes).toBe("number")
          expect(typeof article.article_img_url).toBe("string")
          expect(typeof article.comment_count).toBe("number")
          })
        })
      })
    })
    describe("/api/articles/:articles_id/comments", ()=> {
      test("GET 200: should return with an array of comments for a given article (i.e. article_id)", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
          if(body.comments.length === 0)
          {expect(body.comments).toEqual([])}
          else{
          expect(body.comments).toBeSortedBy("created_at", {descending: true})
          body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.article_id).toBe("number")
          })
          }
        })
      })
      test("GET 404: should return with an error if a valid article_id is given but it doesn't exist", () => {
        return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })    
      })
      test("GET 400: should return with an error if an invalid file path is given", () => {
        return request(app)
        .get("/api/articles/invalid/comments")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
      })
    })
  });
});