const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  messages: [messageSchema]
});

const tutorChatSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', unique: true, required: true },
  chats: [chatSchema]
});

module.exports = mongoose.model('TutorChat', tutorChatSchema);
