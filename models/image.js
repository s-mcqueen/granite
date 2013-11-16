var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ImageSchema = new Schema({
      instagramId : Number,
      instagramUsername : String,
      instagramCreationTime : String,
      caption : String,
      hashtags : [String],
      smallRes : String,
      mediumRes : String,
      largeRes : String,
      lat : Number,
      lon : Number,
      upvotes : Number,
      downvotes : Number
    });

mongoose.model('Image', ImageSchema);
