const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  pagesVisited: [{
    path: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  pageViews: {
    type: Number,
    default: 1
  },
  referrer: {
    type: String,
    default: ''
  },
  lastVisitedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index to quickly find user sessions in the last 24 hours
VisitorSchema.index({ ip: 1, userAgent: 1, lastVisitedAt: -1 });

module.exports = mongoose.model('Visitor', VisitorSchema);
