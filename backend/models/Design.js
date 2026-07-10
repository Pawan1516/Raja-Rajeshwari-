const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  designId: {
    type: String,
    unique: true,
  },
  title_en: {
    type: String,
    required: true,
    trim: true,
  },
  title_te: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  depthMap: {
    type: String,
    default: '',
  },
  description_en: {
    type: String,
    default: '',
  },
  description_te: {
    type: String,
    default: '',
  },
  workType: {
    type: String,
    enum: ['interior', 'electrical', 'lighting'],
    default: 'interior',
  },
  subcategory: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Pre-save hook to auto-generate sequential designId (e.g. RLIW-1001)
DesignSchema.pre('save', async function(next) {
  if (this.designId) return next();

  try {
    const Model = this.constructor;
    // Find the latest design by creation order to increment designId
    const lastDesign = await Model.findOne({}, {}, { sort: { 'createdAt': -1 } });
    
    let nextNum = 1001;
    if (lastDesign && lastDesign.designId) {
      const match = lastDesign.designId.match(/RLIW-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    
    // Double check that the ID is unique
    let isUnique = false;
    while (!isUnique) {
      const tempId = `RLIW-${nextNum}`;
      const duplicate = await Model.findOne({ designId: tempId });
      if (!duplicate) {
        this.designId = tempId;
        isUnique = true;
      } else {
        nextNum++;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Design', DesignSchema);
