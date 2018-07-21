var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var awsIot = require('aws-iot-device-sdk');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();






var device = awsIot.device({
    keyPath: './keys/raspberry.private.key',
    certPath:'./keys/raspberry.cert.pem',
    caPath: './keys/root-CA.crt',
    clientId: 'server',
    host: 'a3c2iyi0nzmfll.iot.us-west-2.amazonaws.com'
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))
app.use('/materialize', express.static(path.join(__dirname, 'node_modules/materialize-css/dist')));
app.use('/mustache', express.static(path.join(__dirname, 'node_modules/mustache/mustache.js')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
