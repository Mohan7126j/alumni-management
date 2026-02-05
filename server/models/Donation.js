const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  donationType: {
    type: String,
    enum: ['one-time', 'recurring', 'scholarship', 'infrastructure', 'program'],
    default: 'one-time'
  },
  designation: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'check', 'crypto', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  impact: {
    description: String,
    beneficiaries: Number,
    outcomes: [String]
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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

donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ donationType: 1 });

module.exports = mongoose.model('Donation', donationSchema);


