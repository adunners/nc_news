const { log } = require("console");
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
  return db
    .query(
      `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `
    )
    .then((articles) => {
      const updatedArticles = articles.rows.map((article) => {
        article.comment_count = Number(article.comment_count);
        return article;
      });

      return updatedArticles;
    });
};

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
      return comments.rows;
    });
};

exports.addCommentToArticleId = (id, body, username) => {

  if (typeof body === "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1
  `,
      [id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return null;
    })
    .then(() => {
      return db
      .query(
        `
    SELECT * FROM users
    WHERE username = $1
    `,
        [username]
      )
      .then((user) => {
        if (user.rows.length === 0 && username !== undefined) {

          return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return null;
      })
    })
    .then(() => {
    return db.query(
        `
   INSERT INTO comments
   (body, article_id, author)
   VALUES
   ($1, $2, $3)
   RETURNING *
  `,
        [body, id, username]
      );
    })
    .then((addedComment) => {
      return addedComment.rows[0];
    });
};


exports.addVotesToArticlesId = (id, votes) => {
  return db.query(
    `
    UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *
  `, [votes, id])

  .then((updatedArticle) => {
    if(updatedArticle.rows.length === 0){
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return updatedArticle.rows[0]
  })
}