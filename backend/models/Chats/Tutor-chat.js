const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  lastChatted: { type: Date, default: Date.now },
  messages: [{
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isSentBySelf: { type: Boolean, default: false }
  }]
});

const tutorChatSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', unique: true, required: true },
  chats: { type: Map, of: messageSchema, default: () => new Map()  }
});

module.exports = mongoose.model('TutorChat', tutorChatSchema);
