
/**
 * Module dependencies.
 */

var express = require('express'),
    index = require('./routes/index'),
    images = require('./routes/images'),
    voting = require('./routes/voting'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');


var app = express();

// setup mongo
if (app.get('env') == 'production') {
  // TODO: set up production database
  var dbString = '';
} else {
  var dbString = 'mongodb://localhost/granite';
}

mongoose.connect(dbString);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * Routes
 */
app.get('/', index.page);
app.get('images', images.images);
app.post('/vote', voting.vote);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

