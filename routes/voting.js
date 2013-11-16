require('../models/image.js');

var mongoose = require('mongoose');
var Img = mongoose.model('Image'); 

/*
 * POST: up and downvoting images.
 */
exports.vote = function(req, res){

  var id = req.body.id;
  var vote = req.body.vote;

  if (vote == 1) {
    Img.update({instagramId: id}, {$inc: {"upvotes":1}}, function(err, image) {
      if (err) {
        console.log(err);
      } else {
        res.json(image);
      }
    });
  } else {
    Img.update({instagramId: id}, {$inc: {"downvotes":1}}, function(err, image) {
      if (err) {
        console.log(err);
      } else {
        res.json(image);
      }
    });
  }
};