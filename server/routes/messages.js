const express = require('express');
const { body, validationResult } = require('express-validator');
const { Message, Conversation } = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'email')
    .populate({
      path: 'participants',
      populate: { path: 'profile', select: 'firstName lastName profilePicture' }
    })
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversations/:conversationId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'email')
      .populate({
        path: 'sender',
        populate: { path: 'profile', select: 'firstName lastName' }
      })
      .populate('recipient', 'email')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      conversation,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, [
  body('recipient').notEmpty(),
  body('content').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { recipient, subject, content } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipient] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipient]
      });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      recipient,
      subject,
      content,
      conversationId: conversation._id
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/messages/unread
// @desc    Get unread message count
// @access  Private
router.get('/unread', protect, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

