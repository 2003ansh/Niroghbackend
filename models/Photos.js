const mongoose = require('mongoose');
const { Schema } = mongoose;
const PhotoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
   event: {
        type: String,
        required: true
    },
    place: {
        type: String,
       required: true
    },
    photo:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
  });

module.exports = mongoose.model('Photo', PhotoSchema);