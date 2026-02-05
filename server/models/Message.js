const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ conversationId: 1 });
messageSchema.index({ createdAt: -1 });

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

conversationSchema.index({ participants: 1 });

module.exports = {
  Message: mongoose.model('Message', messageSchema),
  Conversation: mongoose.model('Conversation', conversationSchema)
};


