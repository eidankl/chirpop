var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//express-generator middleware at the application level to handle maintaining sessions
var session = require('express-session');
//Bootstrapping Passport
var passport = require('passport');

//Initialize models MOngoose Schemas
require('./models/models.js');

//var users = require('./routes/users');
var api = require('./routes/api');
//Authenticate must get a passport as we decleare at authenticate.js: module.exports = function(passport)
var authenticate = require('./routes/authenticate')(passport);

var index = require('./routes/index');




// imports the mongoose module
var mongoose = require('mongoose'); //add for Mongo support

//connects us to the local database:
if(process.env.DEV_ENV){
  mongoose.connect("mongodb://localhost:27017/chrip-test");  //connect to Mongo
}
else{
  mongoose.connect('mongodb://chirpop:chirpop@ds017553.mlab.com:17553/chirpop');
}
//mongoose.connect("mongodb://localhost:27017/chrip-test");  //connect to Mongo


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//middleware session section
app.use(session({
  secret: 'super duper secret'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//add passport as an application level middleware - add it to the bottom of the middleware chain
app.use(passport.initialize());
app.use(passport.session());

/*//Initialize models
require('./models/models.js');*/



////anywhere that user going to root it  bind it with /index (index.js)
app.use('/', index);

//anywhere that write api bind it with /api (api.js)
app.use('/api', api);

//anywhere that write auth bind it with /authenticate (authenticate.js)
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Initialize Passport
var initPassport = require('./passport-init');
//call the passport init with our passport model that we required
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
