var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ImageSchema = new Schema({
      instagramId : String,
      instagramUsername : String,
      instagramCreationTime : String,
      caption : { type: String, default: "" },
      hashtags : { type: [String], default: [""] },
      smallRes : String,
      mediumRes : String,
      largeRes : String,
      upvotes : Number,
      downvotes : Number,
      timestamp : { type : Date, default: Date.now }
    });

mongoose.model('Image', ImageSchema);