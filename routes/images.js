require('../models/image.js');

var mongoose = require('mongoose');
var Img = mongoose.model('Image');

var util = require('../utils/util.js'); 
var request = require('request');


exports.images = function(req, res) {
  var hashtag = req.params.hashtag;
  // go get images for that hashtag from mongo
  getPhotos(hashtag, res);
};

function getPhotos (hashtag, res) {
  var MIN_PHOTOS = 10;
    Img.find({hashtags: { $in: [hashtag]}}, function(err, images){
      if (err) return {};
        // if there are less than MIN_PHOTOS in the database matching the hashtag we should backload
      if (images.length < MIN_PHOTOS) {
        backloadPhotos(hashtag, res);
      } else {
        util.formatImagesForFrontend(images, res);
      }
    });
};

function backloadPhotos (hashtag, res) {
  request('https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?client_id=54a06ba8e25540f19c2cebf8937697d8',       
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).data;
        util.pushToMongo(data, function() {
          Img.find({hashtags: { $in: [hashtag]}}, function(err, images){
            if (err) {
              console.log(err);
              res.json({});
            } else {
              util.formatImagesForFrontend(images, res);
            }
          });
        });
      }
    });
};
