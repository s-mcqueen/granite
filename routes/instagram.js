var request = require('request');
var testData = require('../data/data1.json').data;

require('../models/image.js');
var mongoose = require('mongoose');
var Img = mongoose.model('Image');

exports.test = function(req, res) {
  pushToMongo(testData);
};

/*
 * Perform handshake with instagram.
 *
 */
exports.handshake = function(req, res){
  res.send(request.query['hub.challenge']);
};

/*
 * Respond to callback from instagram
 *
 */
exports.instagramCallback = function(req, res){
  // request recent photos with this tag
  request('https://api.instagram.com/v1/tags/' + req.body[0].object_id + '/media/recent?client_id=54a06ba8e25540f19c2cebf8937697d8',       
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).data;
        pushToMongo(data, function(){});
      }
    });
  // reply to let instagram know we didnt die
  res.send('Thanks');
};

/*
* Takes instagram .data array from api call and pushes to mongo
*
*/
function pushToMongo (data, callback) {
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
}


