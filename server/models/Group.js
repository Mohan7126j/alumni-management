const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['cohort', 'interest', 'chapter', 'geographic', 'industry'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    graduationYear: Number,
    industry: String,
    location: String
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

groupSchema.index({ type: 1 });
groupSchema.index({ 'metadata.graduationYear': 1 });
groupSchema.index({ 'metadata.industry': 1 });

module.exports = mongoose.model('Group', groupSchema);


