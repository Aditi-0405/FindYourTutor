const mongoose = require('mongoose');

const tutorNotifications = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student',  required: true },
    count: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('TutorNotifications', tutorNotifications);