const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true
  },
  venueName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  playersNeeded: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerPhone: {
    type: String,
    required: true
  },
  joinedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isClosed: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
