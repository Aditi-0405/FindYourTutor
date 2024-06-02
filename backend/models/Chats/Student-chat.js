const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
  messages: [messageSchema]
});

const studentChatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', unique: true, required: true },
  chats: [chatSchema]
});

module.exports = mongoose.model('StudentChat', studentChatSchema);
