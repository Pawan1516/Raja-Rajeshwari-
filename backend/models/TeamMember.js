const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  role_te: {
    type: String,
    required: true,
    trim: true,
  },
  exp: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
