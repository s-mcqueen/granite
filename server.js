
/**
 * Module dependencies.
 */

var express = require('express'),
    index = require('./routes/index'),
    images = require('./routes/images'),
    voting = require('./routes/voting'),
    instagram = require('./routes/instagram'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');


var app = express();

// setup mongo
if (app.get('env') != 'development') {
  console.log("prod");
  // TODO: set up production database
  var dbString = 'mongodb://evan:smegma69@ds053678.mongolab.com:53678/exposure';
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
app.get('/images/:hashtag', images.images);
app.post('/vote', voting.vote);

// instagram routes
app.get('/callback', instagram.handshake);
app.post('/callback', instagram.instagramCallback);
app.post('/test', instagram.test)



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

