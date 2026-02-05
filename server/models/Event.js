const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['reunion', 'webinar', 'meetup', 'workshop', 'conference', 'networking'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    trim: true
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String
  },
  maxAttendees: {
    type: Number
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rsvpStatus: {
      type: String,
      enum: ['going', 'maybe', 'not_going'],
      default: 'going'
    },
    rsvpAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  remindersSent: [{
    type: Date
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tags: [{
    type: String,
    trim: true
  }],
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

eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ type: 1 });

module.exports = mongoose.model('Event', eventSchema);

