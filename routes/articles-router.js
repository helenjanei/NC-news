const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  addComment,
  fetchCommentsById,
  getArticles,
  deleteCommentById
} = require('../controllers/articles-controllers');

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)

articlesRouter
  .route("/:article_id/comments")
  .post(addComment)
  .get(fetchCommentsById)

articlesRouter
  .route("/:article_id/comments/:comment_id")
  .delete(deleteCommentById)

articlesRouter
  .route("/")
  .get(getArticles)




module.exports = articlesRouter;