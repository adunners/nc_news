// check in user table if topic (i.e. slug) exists

const db = require("./db/connection");

exports.checkTopicExists = (topic) => {
  if (topic !== undefined && topic.length > 0) {
    return db
      .query(
        `
    SELECT * FROM topics
    WHERE slug = $1
    `,
        [topic]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 400, msg: "Not Found" });
        }
      });
  }
};
