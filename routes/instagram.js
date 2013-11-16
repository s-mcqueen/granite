var request = require('request');
var testData = require('../data/data1.json').data;
var util = require('../utils/util.js');

require('../models/image.js');
var mongoose = require('mongoose');
var Img = mongoose.model('Image');

exports.test = function(req, res) {
  util.pushToMongo(testData);
};

/*
 * Perform handshake with instagram.
 *
 */
exports.handshake = function(req, res){
  res.send(request.query['hub.challenge']);
};

/*
 * Respond to callback from instagram
 *
 */
exports.instagramCallback = function(req, res){
  // request recent photos with this tag
  request('https://api.instagram.com/v1/tags/' + req.body[0].object_id + '/media/recent?client_id=54a06ba8e25540f19c2cebf8937697d8',       
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).data;
        util.pushToMongo(data, function(){});
      }
    });
  // reply to let instagram know we didnt die
  res.send('Thanks');
};

