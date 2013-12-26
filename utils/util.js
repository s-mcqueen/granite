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
 * @param {JSON image} image - image to be formatted
 * @param {JSON object with cutoffs} sizeCutoffs - values for which to cutoff images sizing
 * @return JSON object formatted with correct sizing, score, url, etc.
 */
function formatImage(image, sizeCutoffs) {

  var LARGE = 3, MEDIUM = 2, SMALL = 1   // enum for image size
  var score = (image.upvotes) - (image.downvotes)
  var size = 0   // should never stay 0
  var imgUrl = ""  // should never stay the empty string

  // Send url for smallest file we can get away with -- far less data for frontend to retrieve
  if (score > sizeCutoffs.big) {
    size = LARGE
    imgUrl = image.largeRes
  } else if (score < sizeCutoffs.med) {
    size = SMALL
    imgUrl = image.smallRes
  } else {
    size = MEDIUM
    imgUrl = image.mediumRes
  }

  return {
    "id" : image.instagramId,
    "url" : imgUrl,
    "largeRes": image.largeRes,
    "score" : score,
    "size" : size,
    "user" : image.instagramUsername,
    "status" : image.caption
  };
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
  a = [];
  for (var i in images) {
    a[i] = (images[i].upvotes) - (images[i].downvotes);
  }
  a.sort();

  // create cutoffs based on percentiles
  topTenth = Math.round(a.length - (a.length / 10));
  topThird = Math.round(a.length - (a.length / 3));

  return {
    big: a[topTenth], 
    med: a[topThird]
  }
}

