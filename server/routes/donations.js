const express = require('express');
const { body, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/donations
// @desc    Get all donations (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      donor,
      donationType,
      paymentStatus,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (donor) query.donor = donor;
    if (donationType) query.donationType = donationType;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Non-admins can only see their own donations or public ones
    if (req.user.role !== 'admin') {
      query.$or = [
        { donor: req.user._id },
        { isAnonymous: false }
      ];
    }

    const donations = await Donation.find(query)
      .populate('donor', 'email')
      .populate({
        path: 'donor',
        populate: { path: 'profile', select: 'firstName lastName' }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    // Calculate totals
    const totalAmount = await Donation.aggregate([
      { $match: { ...query, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      count: donations.length,
      total,
      totalAmount: totalAmount[0]?.total || 0,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', protect, [
  body('amount').isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('donationType').isIn(['one-time', 'recurring', 'scholarship', 'infrastructure', 'program']),
  body('paymentMethod').isIn(['credit_card', 'bank_transfer', 'check', 'crypto', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const donation = await Donation.create({
      ...req.body,
      donor: req.user._id
    });

    // Update Give Back Score
    const profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      profile.giveBackScore += 10; // Points for donation
      profile.giveBackBreakdown.donationsCount += 1;
      await profile.save();
    }

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation payment status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update donation status'
      });
    }

    const { paymentStatus, impact } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.paymentStatus = paymentStatus || donation.paymentStatus;
    if (impact) donation.impact = impact;
    await donation.save();

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


