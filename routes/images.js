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
      var returnImages = [];

      for (var i in images) {
        var score = (images[i].upvotes) - (images[i].downvotes)

        // TODO: size assigning algorithm
        // var size = assignSize(score);

        var img = {
          "id" : images[i].instagramId,
          "url" : images[i].largeRes,
          "score" : score,
          "size" : 3,
        };

        returnImages[i] = img;
      }
    res.json(returnImages);
    }
  });
};

