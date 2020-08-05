const usersRouter = require("express").Router();
const {
  getUsername
} = require('../controllers/users-controllers.js');
// const {
//   handleInvalidPath,
//   handleCustomErrors
// } = require('../error-handling/index')

usersRouter
  .route("/:username")
  .get(getUsername)


module.exports = usersRouter;