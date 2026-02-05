const express = require('express');
const { body, validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');
const { protect, requireVerification } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/opportunities
// @desc    Get all opportunities with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      type,
      status,
      industry,
      isRemote,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (isRemote === 'true') query.isRemote = true;

    const opportunities = await Opportunity.find(query)
      .populate('postedBy', 'email')
      .populate({
        path: 'postedBy',
        populate: { path: 'profile', select: 'firstName lastName currentCompany' }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Opportunity.countDocuments(query);

    res.json({
      success: true,
      count: opportunities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/opportunities/:id
// @desc    Get opportunity by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'email')
      .populate({
        path: 'postedBy',
        populate: { path: 'profile', select: 'firstName lastName currentCompany' }
      })
      .populate('applications.applicant', 'email')
      .populate({
        path: 'applications.applicant',
        populate: { path: 'profile', select: 'firstName lastName' }
      });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Increment views
    opportunity.views += 1;
    await opportunity.save();

    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/opportunities
// @desc    Create new opportunity
// @access  Private (Verified alumni/admin)
router.post('/', protect, requireVerification, [
  body('title').trim().notEmpty(),
  body('type').isIn(['job', 'internship', 'referral', 'startup', 'collaboration']),
  body('description').trim().notEmpty(),
  body('company').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const opportunity = await Opportunity.create({
      ...req.body,
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/opportunities/:id/apply
// @desc    Apply to an opportunity
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    if (opportunity.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is not accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = opportunity.applications.find(
      app => app.applicant.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this opportunity'
      });
    }

    opportunity.applications.push({
      applicant: req.user._id,
      notes: req.body.notes
    });

    await opportunity.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


