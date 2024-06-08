const mongoose = require('mongoose');

const studentNotifications = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student',  required: true },
    count: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('StudentNotifications', studentNotifications);