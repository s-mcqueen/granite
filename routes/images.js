require('../models/image.js');

var mongoose = require('mongoose');
var Img = mongoose.model('Image'); 


exports.images = function(req, res) {

  var staticData = [
    { 
      "id" : "1111111111",
      "url": "http:\/\/distilleryimage0.s3.amazonaws.com\/c1a9a3c24e6911e3a7030abda766a197_8.jpg",
      "score": 10,
      "size": 3
    },
    { 
      "id" : "2222222222",
      "url": "http:\/\/distilleryimage9.s3.amazonaws.com\/15fec1c64e4411e3bc5912294d621823_8.jpg",
      "score": 2,
      "size": 1
    },
    { 
      "id" : "3333333333",
      "url": "http:\/\/distilleryimage8.s3.amazonaws.com\/613cd57c4e4111e3914a0e4181867fcb_8.jpg",
      "score": 5,
      "size": 2
    },
    { 
      "id" : "44444444444",
      "url": "http:\/\/distilleryimage9.s3.amazonaws.com\/a191c6884e4011e39166126eed24a06d_8.jpg",
      "score": 13,
      "size": 1
    },
    { 
      "id" : "55555555555",
      "url": "http:\/\/distilleryimage9.s3.amazonaws.com\/4d1026e24e3911e3b3f312f42697c837_8.jpg",
      "score": 13,
      "size": 2
    },
    { 
      "id" : "66666666666",
      "url": "http:\/\/distilleryimage0.s3.amazonaws.com\/42cffff64e6411e38b9412736fcebd95_8.jpg",
      "score": 3,
      "size": 1
    }
  ];

  res.json(staticData);

  // // TODO: only get images that are reasonably new, 
  // // and also with the current hashtag
  // Img.find({}, function(images) {
  //   res.json(images);
  // });
};




