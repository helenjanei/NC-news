const knex = require('../db/data/connection.js');

selectArticleById = (articleId) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({
      comment_count: "comment_id"
    })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", articleId)
    .then((articleRows) => {
      console.log('--> articleRows', articleRows)
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `${articleId} not found`,
        });
      }
      const commentCount = Number(articleRows[0].comment_count);
      articleRows[0].comment_count = commentCount;
      return articleRows[0];
    });
}

patchArticleById = (articleId, incVotes) => {
  // if (incVotes === undefined) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "Missing required fields on request body",s
  // }
  return knex("articles")
    .increment("votes", incVotes)
    .where("article_id", articleId)
    .returning("*")
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'article not found',
        });
      }
      return articleRows[0];
    });
};

module.exports = {
  selectArticleById,
  patchArticleById
}

// an article object, which should have the following properties:

//   author which is the username from the users table
// title
// article_id
// body
// topic
// created_at
// votes
// comment_count which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this