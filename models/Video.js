const mongoose = require('mongoose');
const { Schema } = mongoose;
const VideosSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    videoId: {
          type: String,
          required: true
     },
    date: {
        type: Date,
        default: Date.now
    }
  });

module.exports = mongoose.model('Videos', VideosSchema);