exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({
      msg: err.msg
    });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlCodes = ["22P02", "42703"];
  if (psqlCodes.includes(err.code))
    res.status(400).send({
      msg: "Bad Request!"
    } || {
      msg: err.msg
    });
  else if (err.code === "23503") {
    res.status(404).send({
      msg: "invalid user"
    });
  } else next(err);
};
exports.handle405Errors = (req, res, next) => {
  res.status(405).send({
    msg: "method not allowed"
  });
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({
    msg: "Internal Server Error"
  });
};