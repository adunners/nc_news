const { log } = require("console");
const db = require("../db/connection");
const fs = require("fs/promises");


//GET
exports.fetchTopics = () => {
  return db
    .query(
      `
   SELECT * FROM topics
   `
    )
    .then((result) => {
      return result.rows;
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
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {//if article_id is valid but doesn't exist
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticles = (topic, sort_by="created_at", sort_criteria="DESC") => {

  const validSortByQueries = ["created_at", "article_id", "topic", "author", "title", "votes", "comment_count"]

  if(!validSortByQueries.includes(sort_by)){
    return Promise.reject({status: 400, msg: "Invalid sort_by query"})
  }

  const validSortCriteriaQueries = ["ASC", "DESC"]

  if(!validSortCriteriaQueries.includes(sort_criteria)){
    return Promise.reject({status: 400, msg: "Invalid sort_criteria query"})
  }

  if(topic !== undefined && topic.length === 0){
    return Promise.reject({status:400, msg: "Bad Request - topic cannot be empty"})
  }
  
   let queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `

  const queryParameters = []

  if(topic){
    queryStr += 
    `WHERE topic = $1`
    queryParameters.push(topic)
  }

   queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${sort_criteria}
    `
    return db.query(queryStr, queryParameters)

    .then((articles) => {
      const updatedArticles = articles.rows.map((article) => {
        article.comment_count = Number(article.comment_count);
        return article;
      })
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

exports.fetchComments = () => {
  return db.query(
    `
    SELECT * FROM comments
    `
  ).then((allComments) => {
    return allComments.rows
  })
}

exports.fetchUsers = () => {
  return db.query(
    `
    SELECT * FROM users
    `
  ).then((allUsers) => {
    return allUsers.rows
  })
}

//POST
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
      if (article.rows.length === 0) {//if article_id is valid but doesn't exist
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
      .then((user) => {//if username doesn't exist
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


//PATCH
exports.addVotesToArticlesId = (id, votes) => {
  return db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
  `, [votes, id])

  .then((updatedArticle) => {
    if(updatedArticle.rows.length === 0){//if article_id is valid but doesn't exist
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return updatedArticle.rows[0]
  })
}

//DELETE
exports.removeCommentById = (comment_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `, [comment_id]
  ).then((deletedComment) => {
    if(deletedComment.rows.length === 0){//if comment_id is valid but doesn't exist
      return Promise.reject({status: 404, msg: "Not Found"})
    }
   return deletedComment.rows
  })
}
