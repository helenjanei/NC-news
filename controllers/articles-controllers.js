const {
  selectArticleById,
  selectArticles,
  patchArticleById,
  postComment,
  getCommentsById,
  removeCommentById
} = require('../models/articles-models')

const {
  selectUsername
} = require("../models/users-models");

const {
  selectTopics
} = require("../models/topics-models");


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
      //   console.log('error in catch in get article', err)
      next(err);
    });
};

getArticles = (req, res, next) => {
  const {
    sort_by,
    order,
    author,
    topic
  } = req.query;

  const queries = [selectArticles(sort_by, order, author, topic)];
  if (author) queries.push(selectUsername(author));
  if (topic) queries.push(selectTopics(topic));

  Promise.all(queries)
    .then(([allArticles, result2]) => {
      res.status(200).send({
        allArticles
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
      // console.log('--> patch article in controller', article)
      res.status(200).send({
        article
      });
    })
    .catch(next);
};

addComment = (req, res, next) => {
  const {
    username,
    body
  } = req.body;
  const {
    article_id: articleId
  } = req.params;
  postComment(username, body, articleId)
    .then((comment) => {
      res.status(201).send({
        comment
      });
    })
    .catch(next);
};

fetchCommentsById = (req, res, next) => {
  const {
    article_id: articleId
  } = req.params;
  const {
    sort_by: sortBy,
    order
  } = req.query;
  getCommentsById(articleId, sortBy, order)
    .then((comments) => {
      // console.log({
      //   comments
      // });
      res.send({
        comments
      });
    })
    .catch(next);
};

deleteCommentById = (req, res, next) => {
  const {
    comment_id
  } = req.params;

  removeCommentById(comment_id)
    .then((delCount) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  getArticles,
  updateArticleById,
  addComment,
  fetchCommentsById,
  deleteCommentById
};