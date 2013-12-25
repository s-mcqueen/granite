require('../models/image.js');
var mongoose = require('mongoose');
var Img = mongoose.model('Image');

/*
 * pushToMongo
 * Takes instagram .data array from api call and saves in mongo DB with 
 * all the correct 
 *
 * @param {JSON object of Instgram data} data -- includes all photos. We pull 
 *   data out of this object.
 * @param {function} callback -- what to do after each particular image is saved
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
        upvotes : Math.floor((Math.random()*10)+1),
        downvotes : Math.floor((Math.random()*3)+1)
      });

      (function (imageToSave, innerCallback) {
        Img.find({instagramId: data[i].id}, function(err, data){
          // if there was no error and we didnt find anything go ahead and insert the new photo
          if (!err && (data.length == 0)) {
            imageToSave.save(function (err) {

              // McQueen: need to investigate this innerCallback more.

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

/*
 * formatImagesForFrontend
 * Format and resize backend images for sending to the frontend.
 *
 * @param {Array of JSON images} images - the images for formatting and returning
 * @param {HTTP response object} res - object used to return from http request
 */
exports.formatImagesForFrontend = function (images, res) {
  var fImgs = []
  var sizeCutoffs = assignCutoffs(images)
  for (var i in images) { 
    fImgs[i] = formatImage(images[i], sizeCutoffs) 
  }
  res.json(fImgs)
}

/*
 * formatImage
 * Format and resize a single image for the frontend
 *
 * @param {JSON image} image -
 * @param {JSON object with cutoffs} sizeCutoffs -
 */
function formatImage(image, sizeCutoffs) {
  // enum for image size
  var BIG = 3, MEDIUM = 2, SMALL = 1
  var score = (image.upvotes) - (image.downvotes)
  var size = 0 // should never stay 0
  
  // assign size of the image
  if (score > sizeCutoffs.big) {
    size = BIG
  } else if (score < sizeCutoffs.med) {
    size = SMALL
  } else size = MEDIUM

  // resize the image here based on size variable
  // do we even need a size variable, or can we just use score?

  var formattedImg = {
    "id" : image.instagramId,
    "url" : image.largeRes,
    "score" : score,
    "size" : size,
    "user" : image.instagramUsername,
    "status" : image.caption
  };

  return formattedImg
}


/*
 * assignCutoffs
 * Calculate the cutoff points for images that should be large, medium and small
 * based on their score percentile.
 *
 * @param {Array of JSON images} images - the images to use for calculation
 */
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

  return {
    big: scoreArray[topTenth], 
    med: scoreArray[topThird]
  }
}

