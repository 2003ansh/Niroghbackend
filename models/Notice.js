const mongoose = require('mongoose');
const { Schema } = mongoose;
const NoticeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
   event_name: {
        type: String,
        required: true
    },
    event_date: {   
        type: String,
        required: true,
     },
     event_time: {   
        type: String,
        required: true,
     },
     place: {   
        type: String,
        required: true,
     },
    date: {
        type: Date,
        default: Date.now
    }
  });

module.exports = mongoose.model('Notice', NoticeSchema);