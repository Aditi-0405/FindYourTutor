const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', unique: true, required: true },
  bio: { type: String, default: '' },
  subjectsTaught: { 
    type: Map, 
    of: [String], 
    default: {} 
  },
  rate: { type: Number, default: 0 },
  location: { type: String, default: '' },
  contactInfo: { type: String, default: '' }
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
