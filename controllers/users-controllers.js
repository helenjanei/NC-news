const {
  selectUsername
} = require("../models/users-models");

exports.getUsername = (req, res, next) => {
  const {
    username
  } = req.params;
  selectUsername(username)
    .then((userObject) => {
      res.status(200).send({
        userObject
      });
    })
    .catch((err) => {
      console.log('---> controller err', err)
      next(err);
    });
};