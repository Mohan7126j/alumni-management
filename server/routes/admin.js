const express = require('express');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect, authorize } = require('../middleware/auth');
const transitionService = require('../services/transitionService');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const verifiedAlumni = await User.countDocuments({ role: 'alumni', isVerified: true });
    const pendingVerifications = await User.countDocuments({ 
      role: 'alumni', 
      verificationStatus: 'pending' 
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAlumni,
        totalStudents,
        verifiedAlumni,
        pendingVerifications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/transition-students
// @desc    Manually trigger student to alumni transition
// @access  Private/Admin
router.post('/transition-students', async (req, res) => {
  try {
    const result = await transitionService.checkAndTransitionStudents();

    res.json({
      success: true,
      message: `Transitioned ${result.count} students to alumni`,
      transitions: result.transitions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/transition/:userId
// @desc    Manually transition a specific student to alumni
// @access  Private/Admin
router.post('/transition/:userId', async (req, res) => {
  try {
    const user = await transitionService.transitionStudentToAlumni(req.params.userId);

    res.json({
      success: true,
      message: 'Student transitioned to alumni successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

