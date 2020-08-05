handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({
    msg: err.msg
  });
}

handleInvalidPath = (err, req, res, next) => {
  res.status(404).send({
    msg: 'Path not found'
  });
};

module.exports = {
  handleInvalidPath,
  handleCustomErrors
}