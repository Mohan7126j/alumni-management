const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect, authorize } = require('../middleware/auth');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['alumni', 'student', 'faculty'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, role, firstName, lastName, graduationYear, degree } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      isVerified: role !== 'alumni' // Students and faculty are auto-verified
    });

    // Create profile
    if (firstName && lastName) {
      await Profile.create({
        user: user._id,
        firstName,
        lastName,
        graduationYear: graduationYear || new Date().getFullYear(),
        degree: degree || 'N/A'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'profile',
        select: 'firstName lastName graduationYear currentRole currentCompany'
      });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/verify-alumni/:userId
// @desc    Verify alumni account (Admin only)
// @access  Private/Admin
router.post('/verify-alumni/:userId', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'alumni') {
      return res.status(400).json({
        success: false,
        message: 'Only alumni accounts can be verified'
      });
    }

    user.isVerified = true;
    user.verificationStatus = 'approved';
    user.verifiedBy = req.user._id;
    user.verifiedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Alumni account verified successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/pending-verifications
// @desc    Get pending alumni verifications
// @access  Private/Admin
router.get('/pending-verifications', protect, authorize('admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: 'alumni',
      verificationStatus: 'pending'
    })
    .select('-password')
    .populate('profile', 'firstName lastName graduationYear degree')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

