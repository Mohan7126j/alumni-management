const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const { protect, authorize } = require('../middleware/auth');
const giveBackService = require('../services/giveBackService');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/analytics/community-intelligence
// @desc    Get community intelligence dashboard data
// @access  Private/Admin
router.get('/community-intelligence', authorize('admin'), async (req, res) => {
  try {
    // Alumni distribution by industry
    const industryDistribution = await Profile.aggregate([
      { $match: { industry: { $exists: true, $ne: '' } } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Alumni distribution by country
    const countryDistribution = await Profile.aggregate([
      { $match: { 'location.country': { $exists: true, $ne: '' } } },
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Alumni distribution by graduation year
    const yearDistribution = await Profile.aggregate([
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    // Engagement metrics
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const totalOpportunities = await Opportunity.countDocuments();
    const openOpportunities = await Opportunity.countDocuments({ status: 'open' });

    // Donation metrics
    const donationStats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Top contributors
    const topContributors = await giveBackService.getTopContributors(10);

    res.json({
      success: true,
      data: {
        distribution: {
          industry: industryDistribution,
          country: countryDistribution,
          graduationYear: yearDistribution
        },
        engagement: {
          totalEvents,
          upcomingEvents,
          totalOpportunities,
          openOpportunities
        },
        donations: donationStats[0] || {
          totalAmount: 0,
          count: 0,
          averageAmount: 0
        },
        topContributors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/success-index
// @desc    Get institution-level alumni success index
// @access  Private/Admin
router.get('/success-index', authorize('admin'), async (req, res) => {
  try {
    const totalAlumni = await User.countDocuments({ role: 'alumni', isVerified: true });
    
    // Calculate success metrics
    const profilesWithJobs = await Profile.countDocuments({
      currentRole: { $exists: true, $ne: '' },
      currentCompany: { $exists: true, $ne: '' }
    });

    const mentorshipAvailable = await Profile.countDocuments({
      isAvailableForMentorship: true
    });

    const openToHiring = await Profile.countDocuments({
      isOpenToHiring: true
    });

    const openToReferrals = await Profile.countDocuments({
      isOpenToReferrals: true
    });

    // Calculate success index (0-100)
    const engagementScore = (mentorshipAvailable / totalAlumni) * 30;
    const careerScore = (profilesWithJobs / totalAlumni) * 40;
    const contributionScore = (openToHiring / totalAlumni) * 15 + (openToReferrals / totalAlumni) * 15;

    const successIndex = Math.round(engagementScore + careerScore + contributionScore);

    res.json({
      success: true,
      successIndex,
      breakdown: {
        totalAlumni,
        profilesWithJobs,
        mentorshipAvailable,
        openToHiring,
        openToReferrals,
        engagementScore: Math.round(engagementScore),
        careerScore: Math.round(careerScore),
        contributionScore: Math.round(contributionScore)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/analytics/give-back-leaderboard
// @desc    Get Give Back Score leaderboard
// @access  Private
router.get('/give-back-leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const leaderboard = await giveBackService.getTopContributors(limit);

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

