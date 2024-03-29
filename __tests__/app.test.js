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
          .readFile(`${__dirname}/../endpoints.json`, "utf-8")
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
      test("GET 200: a valid request should return with the total comment_count for the article_id. Comment_count should be an additional property on the return object.", () => {
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
              comment_count: "11",
            });
          });
      });
      test("GET 400: should return with an error message if given an invalid request", () => {
        return request(app)
          .get("/api/articles/invalid-request")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("GET 404: should return with an error message if given an valid request which doesn't exist", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
    describe("/api/articles", () => {
      test("GET 200: should return with an array of all the articles, with each element being an article object. The article object should include all the properties from the test data with an additional property comment_count (sum of all the comments)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(13);
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            body.articles.forEach((article) => {
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
          });
      });
      describe("/api/articles?topic=mitch", () => {
        test("GET 200: should return with an array of articles, which have been filtered by the topic given in the request", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(12);
              body.articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
              });
            });
        });
        test("GET 200: should respond with an empty array given a topic with no articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toEqual([]);
            });
        });
        test("GET 400: should return with an error if given an invalid request, i.e. no topic data provided", () => {
          return request(app)
            .get("/api/articles?topic=")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request - topic cannot be empty");
            });
        });
        test("GET 404: should return with an error if given a valid request but it does not exist, i.e. topic=banana where banana does not exist as a topic", () => {
          return request(app)
            .get("/api/articles?topic=banana")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
            });
        });
      });
      describe("/api/articles?sort_by=created_at", () => {
        test("GET 200: should accept an valid sort_by request, which sorts the articles by any valid column. It should return an array of the sorted articles, with created_at set as the default.", () => {
          return request(app)
            .get("/api/articles?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("created_at", {descending: true})
            });
        });
        test("GET 400: should return an error when given an invalid sort_by request.", () => {
          return request(app)
            .get("/api/articles?sort_by=")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid sort_by query")
            });
        });
      });
      describe(("/api/articles?sort_criteria=ASC"), () => {
        test("GET 200: should accept a valid sort_criteria, either ASC or DESC.It should return an array of articles, sorted by created_at (which is default, in either ascending or descending order (descending is default", () => {
          return request(app)
          .get("/api/articles?sort_criteria=ASC")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {ascending: true})
          });
        })
        test("GET 400: it should return with an error if an invalid sort_criteria is given", () => {
          return request(app)
          .get("/api/articles?sort_criteria=invalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort_criteria query")
          });
        })
      })
    });
    describe("/api/articles/:articles_id/comments", () => {
      test("GET 200: should return with an array of comments for a given article (i.e. article_id)", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            if (body.comments.length === 0) {
              expect(body.comments).toEqual([]);
            } else {
              expect(body.comments).toBeSortedBy("created_at", {
                descending: true,
              });
              body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe("number");
                expect(typeof comment.votes).toBe("number");
                expect(typeof comment.created_at).toBe("string");
                expect(typeof comment.author).toBe("string");
                expect(typeof comment.body).toBe("string");
                expect(typeof comment.article_id).toBe("number");
              });
            }
          });
      });
      test("GET 404: should return with an error if a valid article_id is given but it doesn't exist", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      test("GET 400: should return with an error if an invalid file path is given", () => {
        return request(app)
          .get("/api/articles/invalid/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
    describe("/api/comments", () => {
      test("GET 200: should respond with an array of comment objects, each should have the correct properties", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(18);
            body.comments.forEach((comment) => {
              expect(typeof comment.article_id).toBe("number");
              expect(typeof comment.body).toBe("string");
              expect(typeof comment.votes).toBe("number");
              expect(typeof comment.author).toBe("string");
              expect(typeof comment.comment_id).toBe("number");
              expect(typeof comment.created_at).toBe("string");
            });
          });
      });
    });
    describe("/api/users", () => {
      test("GET 200: should respond with an array of user objects, each should have the correct properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
              expect(typeof user.username).toBe("string");
              expect(typeof user.name).toBe("string");
              expect(typeof user.avatar_url).toBe("string");
            });
          });
      });
    });
  });
  describe("POST test", () => {
    describe("/api/articles/:article_id/comments", () => {
      test("POST 201: should accept a valid comment post request to a specific article (i.e. article_id). It should respond with the posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            body: "excellent work",
            username: "butter_bridge",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.addedComment).toEqual({
              article_id: 1,
              body: "excellent work",
              votes: 0,
              author: "butter_bridge",
              created_at: expect.any(String),
              comment_id: 19,
            });
          });
      });
      test("POST 400: should respond with an error if there are missing keys in the post", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            body: "test",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST 404: should return with an error if an invalid username is given", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "alex",
            body: "excellent work",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      test("POST 400: should return an error if body datatype is number", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: 500,
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST 400: should return an error if an invalid article_id is given", () => {
        return request(app)
          .post("/api/articles/invalid/comments")
          .send({
            username: "butter_bridge",
            body: "excellent work",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST 404: should return an error if an valid file path is given but it doesn't exist", () => {
        return request(app)
          .post("/api/articles/100/comments")
          .send({
            username: "butter_bridge",
            body: "excellent work",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      test("POST 400: should return an error if missing either properties on the post request or wrong property names", () => {
        return request(app)
          .post("/api/articles/invalid/comments")
          .send({
            username: "butter_bridge",
            bodyyy: "excellent work",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
  });
  describe("PATCH test", () => {
    describe("/api/articles/:articles_id", () => {
      test("PATCH 200: should accept a valid patch request, and respond with the updated article, containing the updated votes", () => {
        return request(app)
          .patch("/api/articles/7")
          .send({
            inc_votes: 7,
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: 7,
              title: "Z",
              topic: "mitch",
              author: "icellusedkars",
              body: "I was hungry.",
              created_at: expect.any(String),
              votes: 7,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH 200: should accept a valid patch request, and respond with the updated article, containing the updated votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: -20,
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 80,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH 400: should return an error if given an invalid article_id", () => {
        return request(app)
          .patch("/api/articles/invalid")
          .send({
            inc_votes: 7,
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("PATCH 400: should return an error when an invalid data type is given in patch request", () => {
        return request(app)
          .patch("/api/articles/7")
          .send({
            inc_votes: "banana",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("PATCH 400: should return an error when there is a missing property", () => {
        return request(app)
          .patch("/api/articles/7")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("PATCH 400: should return an error when there is a wrong property name", () => {
        return request(app)
          .patch("/api/articles/7")
          .send({
            inc_votesssss: 7,
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("PATCH 400: should return an error when a valid article_id is given, but it doesn't exist", () => {
        return request(app)
          .patch("/api/articles/100")
          .send({
            inc_votes: 7,
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
  });
  describe("DELETE tests", () => {
    describe("/api/comments/:comment_id", () => {
      test("DELETE 204: should accept a valid delete request, and respond with a status code 204 and no content", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(18);
          })
          .then(() => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204)
              .then(() => {
                return request(app)
                  .get("/api/comments")
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.comments.length).toBe(17);
                  });
              });
          });
      });
      test("DELETE 400: should return with an error if an invalid file path is given", () => {
        return request(app).delete("/api/comments/invalid").expect(400);
      });
      test("DELETE 404: should return with an error if an valid file path is given bur it does not exist", () => {
        return request(app).delete("/api/comments/100").expect(404);
      });
    });
  });
});
