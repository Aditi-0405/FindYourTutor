const mongoose = require('mongoose');
const individualChat = new mongoose.Schema({
    count: { type: Number, required: true, default: 0 }
});

const tutorNotifications = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    count: { type: Number, required: true, default: 0 },
    individualChatCount: {
        type: Map,
        of: individualChat,
        default: function() {
            return new Map();
        }
    }
});

module.exports = mongoose.model('TutorNotifications', tutorNotifications);
