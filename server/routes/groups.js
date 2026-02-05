const express = require('express');
const { body, validationResult } = require('express-validator');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/groups
// @desc    Get all groups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, isPrivate } = req.query;
    const query = {};

    if (type) query.type = type;
    if (isPrivate === 'false') query.isPrivate = false;

    const groups = await Group.find(query)
      .populate('createdBy', 'email')
      .populate({
        path: 'createdBy',
        populate: { path: 'profile', select: 'firstName lastName' }
      })
      .populate('members.user', 'email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: groups.length,
      groups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', protect, [
  body('name').trim().notEmpty(),
  body('type').isIn(['cohort', 'interest', 'chapter', 'geographic', 'industry'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const group = await Group.create({
      ...req.body,
      createdBy: req.user._id,
      admins: [req.user._id],
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    res.status(201).json({
      success: true,
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/groups/:id/join
// @desc    Join a group
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if already a member
    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    group.members.push({
      user: req.user._id
    });

    await group.save();

    res.json({
      success: true,
      message: 'Successfully joined group',
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

