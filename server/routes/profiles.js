const express = require('express');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { protect, requireVerification } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profiles
// @desc    Get all public profiles with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      graduationYear,
      industry,
      country,
      skills,
      search,
      isAvailableForMentorship,
      page = 1,
      limit = 20
    } = req.query;

    const query = { isPublic: true };

    if (graduationYear) query.graduationYear = graduationYear;
    if (industry) query.industry = industry;
    if (country) query['location.country'] = country;
    if (skills) query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    if (isAvailableForMentorship === 'true') query.isAvailableForMentorship = true;
    if (search) {
      query.$text = { $search: search };
    }

    const profiles = await Profile.find(query)
      .populate('user', 'email role isVerified')
      .select('-giveBackBreakdown')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Profile.countDocuments(query);

    res.json({
      success: true,
      count: profiles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'email role isVerified');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete your profile.'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/profiles/:id
// @desc    Get profile by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate('user', 'email role isVerified');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (!profile.isPublic && profile.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This profile is private'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/profiles
// @desc    Create or update profile
// @access  Private
router.post('/', protect, [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('graduationYear').isInt({ min: 1950, max: new Date().getFullYear() + 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      Object.assign(profile, req.body);
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        ...req.body,
        user: req.user._id
      });
    }

    res.status(profile.isNew ? 201 : 200).json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/profiles/me
// @desc    Update own profile
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    Object.assign(profile, req.body);
    profile.updatedAt = new Date();
    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/profiles/me/career-timeline
// @desc    Add career timeline entry
// @access  Private
router.post('/me/career-timeline', protect, requireVerification, [
  body('role').trim().notEmpty(),
  body('company').trim().notEmpty(),
  body('startDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.careerTimeline.push(req.body);
    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


