const mongoose = require('mongoose');
const { Schema } = mongoose;
const ServicesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
   name: {
        type: String,
        required: true
    },
    long_description: {   
        type: String,
        required: true,
     },
     short_description: {   
        type: String,
        required: true,
     },
    status: {
        type: String,
        default: "active"
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

module.exports = mongoose.model('Services', ServicesSchema);