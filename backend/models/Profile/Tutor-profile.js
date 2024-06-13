const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, default: '' }
});
const tutorProfileSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', unique: true, required: true },
  name: { type: String, ref: 'Tutor', required: true },
  bio: { type: String, default: '' },
  subjectsTaught: {
    type: Map,
    of: [String],
    default: {}
  },
  rate: { type: Number, default: 0 },
  location: { type: String, default: '' },
  contactInfo: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  review_cnt: { type: Number, default: 0 },
  reviews: {
    type: Map, of: reviewSchema, 
    default: function () {
      return new Map();
    }
  }
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
