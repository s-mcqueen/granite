require('../models/image.js');
var mongoose = require('mongoose');
var Img = mongoose.model('Image'); 

/*
 * vote
 * Handles POST http requests to vote up images
 *
 * @param {HTTP request object} req -- includes ID of photo to update and the 
 *  desired vote (up (1) or down (0))
 * @param {HTTP response object} res -- object used to return from http request
 */
exports.vote = function(req, res){

  var id = req.body.id
  var vote = req.body.vote

  if (vote === 1) {
    Img.update({instagramId: id}, {$inc: {"upvotes":1}}, function(err, image) {
      if (err) {
        console.log(err)
      } else {
        res.json(image)
      }
    });
  } else {
    Img.update({instagramId: id}, {$inc: {"downvotes":1}}, function(err, image) {
      if (err) {
        console.log(err)
      } else {
        res.json(image)
      }
    });
  }
};