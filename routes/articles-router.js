const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById
} = require('../controllers/articles-controllers');

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)


module.exports = articlesRouter;