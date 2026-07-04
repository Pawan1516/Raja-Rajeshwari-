const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name_en: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name_te: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  workType: {
    type: String,
    enum: ['interior', 'electrical', 'lighting'],
    default: 'interior',
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
