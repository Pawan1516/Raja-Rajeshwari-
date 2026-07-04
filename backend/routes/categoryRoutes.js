const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { upload, isCloudinaryConfigured } = require('../config/cloudinary');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.workType) {
      query.workType = req.query.workType;
    }
    const categories = await Category.find(query).sort({ name_en: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving categories' });
  }
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private (Admin Only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name_en, name_te } = req.body;

  try {
    if (!name_en || !name_te) {
      return res.status(400).json({ message: 'Please provide both English and Telugu category names' });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name_en });
    if (existing) {
      return res.status(400).json({ message: 'Category with this English name already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      if (isCloudinaryConfigured) {
        imageUrl = req.file.path; // Cloudinary URL
      } else {
        // Local path URL (served statically via backend express server)
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const newCategory = new Category({
      name_en,
      name_te,
      image: imageUrl || req.body.image || '',
      workType: req.body.workType || 'interior',
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin Only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { name_en, name_te } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name_en) category.name_en = name_en;
    if (name_te) category.name_te = name_te;
    if (req.body.workType) category.workType = req.body.workType;

    if (req.file) {
      if (isCloudinaryConfigured) {
        category.image = req.file.path;
      } else {
        category.image = `/uploads/${req.file.filename}`;
      }
    } else if (req.body.image) {
      category.image = req.body.image;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating category' });
  }
});

module.exports = router;
