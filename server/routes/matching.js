const express = require('express');
const { protect, requireVerification } = require('../middleware/auth');
const matchingService = require('../services/matchingService');

const router = express.Router();

// @route   GET /api/matching/mentors
// @desc    Find mentor matches for current user
// @access  Private
router.get('/mentors', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const matches = await matchingService.findMentorMatches(req.user._id, limit);

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/matching/career
// @desc    Find career-aligned alumni matches
// @access  Private
router.get('/career', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const matches = await matchingService.findCareerMatches(req.user._id, limit);

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/matching/suggestions
// @desc    Get personalized match suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const suggestions = await matchingService.getMatchSuggestions(req.user._id);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


