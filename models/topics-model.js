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
    .readFile(
      "/home/alex/northcoders/backend/project/be-nc-news/endpoints.json",
      "utf-8"
    )
    .then((endpoinstJson) => {
      return JSON.parse(endpoinstJson);
    });
};
