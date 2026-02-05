const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * AI-like Matching Service
 * Rule-based matching logic for mentor-mentee pairing and career alignment
 */

// Calculate compatibility score between two profiles
const calculateCompatibility = (profile1, profile2, matchType) => {
  let score = 0;
  const maxScore = 100;

  if (matchType === 'mentor-mentee') {
    // Industry match (30 points)
    if (profile1.industry && profile2.industry && profile1.industry === profile2.industry) {
      score += 30;
    }

    // Skills overlap (25 points)
    const commonSkills = profile1.skills.filter(skill => 
      profile2.skills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    score += Math.min(25, (commonSkills.length / Math.max(profile1.skills.length, profile2.skills.length)) * 25);

    // Career level difference (20 points) - mentor should be more experienced
    const yearDiff = profile1.graduationYear - profile2.graduationYear;
    if (yearDiff > 0 && yearDiff <= 15) {
      score += 20;
    } else if (yearDiff > 0) {
      score += 10;
    }

    // Location match (15 points)
    if (profile1.location?.country && profile2.location?.country) {
      if (profile1.location.country === profile2.location.country) {
        score += 15;
        if (profile1.location.city === profile2.location.city) {
          score += 5;
        }
      }
    }

    // Mentorship areas match (10 points)
    if (profile1.mentorshipAreas && profile2.mentorshipAreas) {
      const commonAreas = profile1.mentorshipAreas.filter(area =>
        profile2.mentorshipAreas.some(a => a.toLowerCase() === area.toLowerCase())
      );
      score += Math.min(10, commonAreas.length * 5);
    }
  } else if (matchType === 'career-alignment') {
    // Industry match (40 points)
    if (profile1.industry && profile2.industry && profile1.industry === profile2.industry) {
      score += 40;
    }

    // Skills overlap (35 points)
    const commonSkills = profile1.skills.filter(skill =>
      profile2.skills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    score += Math.min(35, (commonSkills.length / Math.max(profile1.skills.length, profile2.skills.length)) * 35);

    // Role similarity (25 points)
    if (profile1.currentRole && profile2.currentRole) {
      const role1Words = profile1.currentRole.toLowerCase().split(/\s+/);
      const role2Words = profile2.currentRole.toLowerCase().split(/\s+/);
      const commonWords = role1Words.filter(word => role2Words.includes(word));
      score += Math.min(25, (commonWords.length / Math.max(role1Words.length, role2Words.length)) * 25);
    }
  }

  return Math.min(maxScore, Math.round(score));
};

// Find mentor matches for a mentee
exports.findMentorMatches = async (menteeUserId, limit = 10) => {
  try {
    const menteeProfile = await Profile.findOne({ user: menteeUserId });
    if (!menteeProfile) {
      throw new Error('Mentee profile not found');
    }

    // Find potential mentors
    const mentors = await Profile.find({
      user: { $ne: menteeUserId },
      isAvailableForMentorship: true,
      isPublic: true
    })
    .populate('user', 'email role isVerified')
    .limit(50); // Get more candidates for better matching

    // Calculate compatibility scores
    const matches = mentors.map(mentor => ({
      profile: mentor,
      compatibilityScore: calculateCompatibility(mentor, menteeProfile, 'mentor-mentee'),
      matchReasons: generateMatchReasons(mentor, menteeProfile, 'mentor-mentee')
    }));

    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return matches.slice(0, limit);
  } catch (error) {
    throw error;
  }
};

// Find career-aligned alumni for students
exports.findCareerMatches = async (studentUserId, limit = 10) => {
  try {
    const studentProfile = await Profile.findOne({ user: studentUserId });
    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    // Find alumni with similar career paths
    const alumni = await Profile.find({
      user: { $ne: studentUserId },
      isPublic: true
    })
    .populate({
      path: 'user',
      match: { role: 'alumni', isVerified: true }
    })
    .limit(50);

    // Filter out null users (non-alumni)
    const validAlumni = alumni.filter(p => p.user);

    // Calculate compatibility scores
    const matches = validAlumni.map(alumniProfile => ({
      profile: alumniProfile,
      compatibilityScore: calculateCompatibility(alumniProfile, studentProfile, 'career-alignment'),
      matchReasons: generateMatchReasons(alumniProfile, studentProfile, 'career-alignment')
    }));

    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return matches.slice(0, limit);
  } catch (error) {
    throw error;
  }
};

// Generate human-readable match reasons
const generateMatchReasons = (profile1, profile2, matchType) => {
  const reasons = [];

  if (matchType === 'mentor-mentee') {
    if (profile1.industry === profile2.industry) {
      reasons.push(`Same industry: ${profile1.industry}`);
    }
    const commonSkills = profile1.skills.filter(skill =>
      profile2.skills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    if (commonSkills.length > 0) {
      reasons.push(`Shared skills: ${commonSkills.slice(0, 3).join(', ')}`);
    }
    const yearDiff = profile1.graduationYear - profile2.graduationYear;
    if (yearDiff > 0) {
      reasons.push(`${yearDiff} years of experience ahead`);
    }
  } else if (matchType === 'career-alignment') {
    if (profile1.industry === profile2.industry) {
      reasons.push(`Same industry: ${profile1.industry}`);
    }
    if (profile1.currentRole && profile2.currentRole) {
      reasons.push(`Similar roles: ${profile1.currentRole} ↔ ${profile2.currentRole}`);
    }
  }

  return reasons;
};

// Get match suggestions for a user
exports.getMatchSuggestions = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const suggestions = {
      mentors: [],
      careerMatches: []
    };

    if (user.role === 'student' || user.role === 'alumni') {
      suggestions.mentors = await this.findMentorMatches(userId, 5);
    }

    if (user.role === 'student') {
      suggestions.careerMatches = await this.findCareerMatches(userId, 5);
    }

    return suggestions;
  } catch (error) {
    throw error;
  }
};


