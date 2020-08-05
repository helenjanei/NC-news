const {
  selectArticleById,
  patchArticleById
} = require('../models/articles-models')

getArticleById = (req, res, next) => {
  const {
    article_id: articleID
  } = req.params;
  selectArticleById(articleID)
    .then((article) => {
      res.status(200).send({
        article
      });
    })
    .catch((err) => {
      next(err);
    });
};

updateArticleById = (req, res, next) => {
  const {
    article_id: articleId
  } = req.params;
  const {
    inc_votes: incVotes
  } = req.body;
  patchArticleById(articleId, incVotes)
    .then((article) => {
      res.status(200).send({
        article
      });
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  updateArticleById
};