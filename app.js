const db = require("./db");
const knex = require("knex")(db);
const fs = require("fs");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const logStream = fs.createWriteStream(path.join(__dirname, "access.txt"), {
  flags: "a",
});

app.use(logger("common", { stream: logStream }));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/version", (req, res) =>
  req.db.raw("SELECT VERSION()").then((version) => res.send(version[0][0]))
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
