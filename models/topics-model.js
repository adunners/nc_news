const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  return db
    .query(
      `
   SELECT * FROM topics
   `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchApi = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpoinstJson) => {
      return JSON.parse(endpoinstJson);
    });
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};
