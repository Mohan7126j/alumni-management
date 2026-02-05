const User = require('../models/User');
const Profile = require('../models/Profile');

/**
 * Student to Alumni Auto-Transition Service
 * Innovation Hook: Automatically transitions students to alumni after graduation
 */

// Check and transition students to alumni
exports.checkAndTransitionStudents = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    // Transition students who graduated (assuming graduation in May/June)
    // Check students with graduation year <= current year and it's past graduation month
    const profilesToTransition = await Profile.find({
      graduationYear: { $lte: currentYear }
    })
    .populate('user')
    .where('user.role').equals('student');

    const transitions = [];

    for (const profile of profilesToTransition) {
      if (profile.user && profile.user.role === 'student') {
        // Check if graduation has passed (assuming May/June graduation)
        const shouldTransition = 
          profile.graduationYear < currentYear ||
          (profile.graduationYear === currentYear && currentMonth >= 5);

        if (shouldTransition) {
          profile.user.role = 'alumni';
          profile.user.isVerified = false; // Require verification for new alumni
          profile.user.verificationStatus = 'pending';
          await profile.user.save();

          transitions.push({
            userId: profile.user._id,
            email: profile.user.email,
            graduationYear: profile.graduationYear
          });
        }
      }
    }

    return {
      count: transitions.length,
      transitions
    };
  } catch (error) {
    throw error;
  }
};

// Manual transition (for admin)
exports.transitionStudentToAlumni = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'student') {
      throw new Error('User is not a student');
    }

    user.role = 'alumni';
    user.isVerified = false;
    user.verificationStatus = 'pending';
    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};


