const {
  selectTopics
} = require("../models/topics-models");

const getAllTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({
        topics,
      });
    })
    .catch(next);
};

module.exports = {
  getAllTopics
}