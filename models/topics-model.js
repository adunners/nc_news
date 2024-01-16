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

exports.fetchArticles = () => {
  return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `)
    .then((articles) => {

      const updatedArticles = articles.rows.map((article) => {
      article.comment_count = Number(article.comment_count)
      return article
      })
  
      return updatedArticles
    })
}

exports.fetchArticleIdComments = (id) => {
  return db
  .query(
    `
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC
  `,
    [id]
  )
  .then((comments) => {
    return comments.rows
  })
}