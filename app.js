var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');
var terms = require('./routes/terms');
var feedback = require('./routes/feedback');
var feedbackconfirm = require('./routes/feedback-confirm');

var depts = require('./bin/departments');
var cas = require('./bin/cas');
var session = require('express-session')

var port = process.env.PORT || '3000';
var host = process.env.HOST || 'localhost';
var sessionSecret = process.env.SESSION_SECRET || 'e70a1e1ee4b8f662f78'

var duration = 1000 * 60 * 60 * 24 * 7; //one week

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
//app.use('/users', users);
//app.use('/cas', cas);
//app.use('/listings', listings);
app.use('/terms', terms);
app.use('/feedback', feedback);
app.use('/feedback/confirm', feedbackconfirm);

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));


var user = "";
var auth = cas(host, port);

app.get('/logout', auth.logout);

app.get('/users', auth.bounce, users);

app.get('/listings', auth.bounce, listings);
//app.get('/listings', listings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
