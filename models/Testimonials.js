const mongoose = require('mongoose');
const { Schema } = mongoose;
const TestimonialSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
          type: String,
          required: true
     },
     rating:{
        type: String,
        required: true
     },
    message: {
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

module.exports = mongoose.model('Testimonial', TestimonialSchema);