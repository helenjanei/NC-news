const knex = require('../db/data/connection.js');

const selectArticleById = (articleId) => {
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
      // console.log('--> articleRows', articleRows)
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `${articleId} not found`,
        });
      }

      const commentCount = Number(articleRows[0].comment_count);
      articleRows[0].comment_count = commentCount;
      return articleRows[0];
    });
}

const selectArticles = (sort_by, order, author, topic) => {
  // if (sort_by !== "articles.author" ||
  //   "title" ||
  //   "articles.article_id" ||
  //   "topic" ||
  //   "articles.created_at" ||
  //   "articles.votes") {
  //   return Promise.reject({
  //     status: 400,
  //     message: "Bad request",
  //   })
  // } else
  if (order !== undefined && order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      message: "Bad request",
    });
  } else
    return knex
      .select(
        "articles.author",
        "title",
        "articles.article_id",
        "topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count("comments.article_id AS comment_count")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .modify((query) => {
        if (author) query.where("articles.author", author);
        if (topic) query.where("articles.topic", topic);
      })
      .then((articles) => {
        //console.log('articles in model',
        //  articles) 
        return articles;
        //Promise.reject({ status: 404, msg: "resource not found" });
      });
};

const patchArticleById = (articleId, incVotes) => {
  return knex("articles")
    .increment("votes", incVotes)
    .where("article_id", articleId)
    .returning("*")
    .then((articleRows) => {
      //console.log('--> article rows patch', articleRows)
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'article Id not found',
        });
      }
      // console.log('---> return article rows patch controller', articleRows[0]);
      return articleRows[0];
    });
};

const postComment = (username, body, articleId) => {
  //console.log('--> articleId in postComments', articleId);
  return knex
    .select("*")
    .from("articles")
    .where("article_id", articleId)
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Article not found`,
        });
      } else
        return knex
          .insert({
            author: username,
            article_id: articleId,
            body
          })
          .into("comments")
          .returning(["comment_id", "votes", "created_at", "author", "body"])
          .then((commentRows) => {
            return commentRows[0];
          });
    });
};

const getCommentsById = (
  articleId,
  sortBy = "created_at",
  order = "desc"
) => {
  // console.log(sortBy);
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(sortBy, order)
    .then((commentRows) => {
      if (commentRows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Article not found`,
        });
      } else return commentRows;
    });
};

const removeCommentById = (comment_id) => {
  return knex("comments")
    .where("comment_id", comment_id)
    .del()
    .then((delCount) => {
      if (delCount === 0)
        return Promise.reject({
          status: 404,
          message: "comment_id not found"
        });
    });
}

module.exports = {
  selectArticleById,
  selectArticles,
  patchArticleById,
  postComment,
  getCommentsById,
  removeCommentById
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