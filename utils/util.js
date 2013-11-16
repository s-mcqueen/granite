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

      // get image ready for insert
      var newImage = new Img({
        instagramId : data[i].id,
        instagramUsername : data[i].username,
        instagramCreationTime : data[i].created_time,
        caption : data[i].caption.text,
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
