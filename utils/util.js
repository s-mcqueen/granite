require('../models/image.js');
var mongoose = require('mongoose');
var Img = mongoose.model('Image');

/*
* Takes instagram .data array from api call and pushes to mongo
*
*/
exports.pushToMongo = function (data, callback) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'image') {
      var caption = '';
      if (data[i].caption != null) {
        caption = data[i].caption.text;
      }

      // get image ready for insert
      var newImage = new Img({
        instagramId : data[i].id,
        instagramUsername : data[i].username,
        instagramCreationTime : data[i].created_time,
        caption : caption,
        hashtags : data[i].tags,
        smallRes : data[i].images.thumbnail.url,
        mediumRes : data[i].images.low_resolution.url,
        largeRes : data[i].images.standard_resolution.url,
        upvotes : 0,
        downvotes : 0
      });

      (function (imageToSave, innerCallback) {
        Img.find({instagramId: data[i].id}, function(err, data){
          // if there was no error and we didnt find anything go ahead and insert the new photo
          if (!err && (data.length == 0)) {
            imageToSave.save(function (err) {
              innerCallback();
              if (err) {
                console.log(err);
              }
            });
          }
        });
      })(newImage, callback);
    }
  }
};

exports.formatImagesForFrontend = function (images, res) {

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

