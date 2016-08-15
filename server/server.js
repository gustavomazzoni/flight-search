var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var cors = require('./lib/cors');
var routesAPIv1 = require('./routes/api/v1');

var app = express();

// Allow CrossDomain
app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Expose static files
app.use(express.static(config.server.publicFolder));

// Expose REST API endpoints
// anything beginning with "/api/v1" will go into this
app.use(config.server.apiV1Url, routesAPIv1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


exports = module.exports = app;
