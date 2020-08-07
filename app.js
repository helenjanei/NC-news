const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

app.use(express.json());
app.use('/api', apiRouter);
app.use((err, req, res, next) => {
  res.status(err.status).send({
    message: err.message
  })
})

app.use((req, res, next) => {
  res.status(405).send({
    message: "method not allowed"
  });
});

app.use((err, req, res, next) => {
  res.status(400).send({
    message: 'Bad request'
  })
})

app.use((err, req, res, next) => {
  const badReqCodes = ["22P02", "42703"];
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