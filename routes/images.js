require('../models/image.js');

var mongoose = require('mongoose');
var Img = mongoose.model('Image'); 


exports.images = function(req, res) {
  var hashtag = req.params.hashtag;

  // go get images for that hashtag from mongo
  Img.find({hashtags: {$in: [hashtag]}}, function(err, images) {
    if (err) {
      console.log(err);
      res.json({});
    }
    else {
      formatImagesForFrontend(images, res);
    }
  });
};


function formatImagesForFrontend(images, res) {

  var sizeCutoffs = assignCutoffs(images);
  
  var returnImages = [];
  for (var i in images) {
    var score = (images[i].upvotes) - (images[i].downvotes)
    var size = 0;

    if (score > sizeCutoffs[1]) {
      if (score > sizeCutoffs[0]) {
        size = 3; // big
      } else {
        size = 2; // medium
      }
    } else {
      size = 1; // small
    }

    var img = {
      "id" : images[i].instagramId,
      "url" : images[i].largeRes,
      "score" : score,
      "size" : size,
    };
    returnImages[i] = img;
  }
  res.json(returnImages);
}


function assignCutoffs(images) {

  // create sorted array of scores
  scoreArray = [];
  for (var i in images) {
    scoreArray[i] = (images[i].upvotes) - (images[i].downvotes);
  }
  scoreArray.sort();

  // create cutoffs based on percentiles
  topTenth = Math.round(scoreArray.length - (scoreArray.length / 10));
  topThird = Math.round(scoreArray.length - (scoreArray.length / 3));
  bigCutoff = scoreArray[topTenth];
  mediumCutoff = scoreArray[topThird];

  return [bigCutoff, mediumCutoff];
}
