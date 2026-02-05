const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['job', 'internship', 'referral', 'startup', 'collaboration'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  requirements: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },
  applicationDeadline: {
    type: Date
  },
  applicationLink: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected'],
      default: 'pending'
    },
    notes: String
  }],
  views: {
    type: Number,
    default: 0
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

opportunitySchema.index({ type: 1, status: 1 });
opportunitySchema.index({ postedBy: 1 });
opportunitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);

