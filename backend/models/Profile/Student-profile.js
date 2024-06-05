const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', unique: true, required: true },
  name: { type: String, ref: 'Student', required: true },
  class: { type: String, default: '' },
  bio: { type: String, default: '' },
  subjectsInterested: { type: [String], default: [] },
  location: { type: String, default: '' },
  contactInfo: { type: String, default: '' }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
