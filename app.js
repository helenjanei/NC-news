const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

app.use(express.json());
app.use('/api', apiRouter);
app.use((err, req, res, next) => {
  res.status(err.status).send({
    message: err.msg
  })
})


//use this for error handling


module.exports = app;