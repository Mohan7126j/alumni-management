const Profile = require('../models/Profile');

/**
 * Give Back Score Service
 * Innovation Hook: Tracks and calculates alumni contribution to the community
 */

// Calculate Give Back Score based on activities
exports.calculateGiveBackScore = async (userId) => {
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new Error('Profile not found');
    }

    const breakdown = profile.giveBackBreakdown || {
      mentorshipHours: 0,
      referralsGiven: 0,
      talksGiven: 0,
      donationsCount: 0,
      eventsAttended: 0
    };

    // Scoring algorithm
    let score = 0;
    
    // Mentorship: 5 points per hour
    score += breakdown.mentorshipHours * 5;
    
    // Referrals: 15 points per referral
    score += breakdown.referralsGiven * 15;
    
    // Talks/Webinars: 25 points per talk
    score += breakdown.talksGiven * 25;
    
    // Donations: 10 points per donation
    score += breakdown.donationsCount * 10;
    
    // Events: 5 points per event attended
    score += breakdown.eventsAttended * 5;

    profile.giveBackScore = Math.max(0, score);
    await profile.save();

    return {
      score: profile.giveBackScore,
      breakdown
    };
  } catch (error) {
    throw error;
  }
};

// Update Give Back Score for specific activity
exports.updateGiveBackActivity = async (userId, activityType, value = 1) => {
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new Error('Profile not found');
    }

    if (!profile.giveBackBreakdown) {
      profile.giveBackBreakdown = {
        mentorshipHours: 0,
        referralsGiven: 0,
        talksGiven: 0,
        donationsCount: 0,
        eventsAttended: 0
      };
    }

    switch (activityType) {
      case 'mentorship':
        profile.giveBackBreakdown.mentorshipHours += value;
        break;
      case 'referral':
        profile.giveBackBreakdown.referralsGiven += value;
        break;
      case 'talk':
        profile.giveBackBreakdown.talksGiven += value;
        break;
      case 'donation':
        profile.giveBackBreakdown.donationsCount += value;
        break;
      case 'event':
        profile.giveBackBreakdown.eventsAttended += value;
        break;
    }

    // Recalculate score
    await this.calculateGiveBackScore(userId);

    return profile.giveBackScore;
  } catch (error) {
    throw error;
  }
};

// Get top contributors
exports.getTopContributors = async (limit = 10) => {
  try {
    const topContributors = await Profile.find({ isPublic: true })
      .populate('user', 'email role isVerified')
      .sort({ giveBackScore: -1 })
      .limit(limit)
      .select('firstName lastName giveBackScore giveBackBreakdown currentRole currentCompany');

    return topContributors;
  } catch (error) {
    throw error;
  }
};

