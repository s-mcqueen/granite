require('../models/image.js');

var mongoose = require('mongoose');
var Img = mongoose.model('Image'); 


var staticData = {
  instagramId : Number,
  instagramUsername : String,
  instagramCreationTime : String,
  caption : String,
  hashtags : [String],
  smallRes : String,
  mediumRes : String,
  largeRes : String,
  lat : Number,
  lon : Number,
  upvotes : Number,
  downvotes : Number
}







exports.images = function(req, res) {

  // TODO: only get images that are reasonably new, 
  // and also with the current hashtag
  Img.find({}, function(images) {
    res.json(images);
  });
};