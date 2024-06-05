const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isSentBySelf:{type: Boolean, default: false}
});

const tutorChatSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', unique: true, required: true },
  chats: { type: Map, of: [messageSchema], default: {} }
});

module.exports = mongoose.model('TutorChat', tutorChatSchema);
