const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

app.use(express.json());
app.use('/api', apiRouter);
app.use((err, req, res, next) => {
  //console.log('err in app', err)
  res.status(err.status).send({
    message: err.msg
  })
})

app.use(handle405s = (req, res, next) => {
  res.status(405).send({
    msg: "method not allowed"
  });
});

app.use(handle400s = (req, res, next) => {
  res.status(400).send({
    msg: 'Bad request'
  })
})

app.use(handlePSQLErrors = (err, req, res, next) => {
  const badReqCodes = ["22P02", "23503", "23502", "42703", "22003"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({
      message: "Bad request"
    });
  } else {
    next(err);
  }
});

//use this for error handling


module.exports = app;