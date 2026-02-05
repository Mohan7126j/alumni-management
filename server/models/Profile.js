const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required'],
    min: [1950, 'Graduation year must be valid'],
    max: [new Date().getFullYear() + 5, 'Graduation year cannot be in the future']
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  currentRole: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  location: {
    country: String,
    city: String,
    state: String
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isAvailableForMentorship: {
    type: Boolean,
    default: false
  },
  mentorshipAreas: [{
    type: String,
    trim: true
  }],
  isOpenToReferrals: {
    type: Boolean,
    default: false
  },
  isOpenToHiring: {
    type: Boolean,
    default: false
  },
  careerTimeline: [{
    role: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
    current: Boolean
  }],
  giveBackScore: {
    type: Number,
    default: 0,
    min: 0
  },
  giveBackBreakdown: {
    mentorshipHours: { type: Number, default: 0 },
    referralsGiven: { type: Number, default: 0 },
    talksGiven: { type: Number, default: 0 },
    donationsCount: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
profileSchema.index({ firstName: 'text', lastName: 'text', currentCompany: 'text', skills: 'text' });
profileSchema.index({ graduationYear: 1 });
profileSchema.index({ industry: 1 });
profileSchema.index({ location: { country: 1, city: 1 } });

module.exports = mongoose.model('Profile', profileSchema);

