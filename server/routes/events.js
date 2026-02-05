const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { protect, requireVerification } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      type,
      status,
      upcoming,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
      query.status = 'upcoming';
    }

    const events = await Event.find(query)
      .populate('organizer', 'email')
      .populate({
        path: 'organizer',
        populate: { path: 'profile', select: 'firstName lastName' }
      })
      .populate('attendees.user', 'email')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'email')
      .populate({
        path: 'organizer',
        populate: { path: 'profile', select: 'firstName lastName' }
      })
      .populate('attendees.user', 'email')
      .populate({
        path: 'attendees.user',
        populate: { path: 'profile', select: 'firstName lastName graduationYear' }
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Verified users)
router.post('/', protect, requireVerification, [
  body('title').trim().notEmpty(),
  body('type').isIn(['reunion', 'webinar', 'meetup', 'workshop', 'conference', 'networking']),
  body('description').trim().notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const event = await Event.create({
      ...req.body,
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to an event
// @access  Private
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const { rsvpStatus } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already RSVP'd
    const existingRSVP = event.attendees.find(
      attendee => attendee.user.toString() === req.user._id.toString()
    );

    if (existingRSVP) {
      existingRSVP.rsvpStatus = rsvpStatus || 'going';
      existingRSVP.rsvpAt = new Date();
    } else {
      event.attendees.push({
        user: req.user._id,
        rsvpStatus: rsvpStatus || 'going'
      });
    }

    await event.save();

    res.json({
      success: true,
      message: 'RSVP updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


