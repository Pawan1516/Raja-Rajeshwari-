const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { upload, isCloudinaryConfigured, processAndUploadImage } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Helper to save base64 depth map
const saveDepthMap = async (depthMapBase64) => {
  if (!depthMapBase64 || !depthMapBase64.startsWith('data:image')) {
    return '';
  }
  
  if (isCloudinaryConfigured) {
    try {
      const uploadRes = await cloudinary.uploader.upload(depthMapBase64, {
        folder: 'rliw_designs',
      });
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Error uploading depth map to Cloudinary:', err);
      return '';
    }
  } else {
    try {
      const base64Data = depthMapBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `depthmap-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      return `/uploads/${filename}`;
    } catch (err) {
      console.error('Error saving depth map locally:', err);
      return '';
    }
  }
};

// @route   GET /api/designs
// @desc    Get all designs (with optional category and search filters)
// @access  Public
router.get('/', async (req, res) => {
  const { category, search, workType } = req.query;
  let query = {};

  try {
    if (category) {
      query.category = category;
    }

    if (workType) {
      query.workType = workType;
    }

    if (search) {
      query.$or = [
        { title_en: { $regex: search, $options: 'i' } },
        { title_te: { $regex: search, $options: 'i' } },
        { designId: { $regex: search, $options: 'i' } },
        { description_en: { $regex: search, $options: 'i' } },
        { description_te: { $regex: search, $options: 'i' } }
      ];
    }

    const designs = await Design.find(query)
      .populate('category', 'name_en name_te')
      .sort({ createdAt: -1 });

    res.json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving designs' });
  }
});

// @route   GET /api/designs/:id
// @desc    Get design by ID or designId (e.g. RLIW-1001)
// @access  Public
router.get('/:id', async (req, res) => {
  const param = req.params.id;

  try {
    let design;
    if (param.startsWith('RLIW-')) {
      design = await Design.findOne({ designId: param }).populate('category', 'name_en name_te');
    } else {
      design = await Design.findById(param).populate('category', 'name_en name_te');
    }

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving design details' });
  }
});

// @route   POST /api/designs/bulk
// @desc    Bulk create designs (Admin Only)
// @access  Private (Admin Only)
router.post('/bulk', auth, upload.array('images', 20), async (req, res) => {
  const { categoryOverride, subcategoryOverride, titleOverride } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded for bulk processing' });
  }

  const { analyzeImage } = require('../services/aiService');
  const results = [];

  try {
    for (const file of req.files) {
      // 1. Resolve image url by compressing and uploading
      const imageUrl = await processAndUploadImage(file);

      // 2. Perform AI Vision/Logic analysis using in-memory buffer
      const analysis = await analyzeImage(file.buffer, file.originalname);

      // 3. Apply Overrides if provided
      let finalCategoryName = analysis.category;
      let finalSubcategory = subcategoryOverride || analysis.subcategory;
      let finalTitleEn = titleOverride
        ? `${titleOverride} - ${finalSubcategory}`
        : analysis.title_en;
      let finalWorkType = analysis.workType;

      // If manual category override is specified, get it from DB
      let categoryId;
      if (categoryOverride && categoryOverride !== 'undefined') {
        const catDoc = await Category.findById(categoryOverride);
        if (catDoc) {
          categoryId = catDoc._id;
          finalCategoryName = catDoc.name_en;
          finalWorkType = catDoc.workType;
        }
      }

      // If no categoryOverride, look up Category in the database matching detected name_en
      if (!categoryId) {
        let catDoc = await Category.findOne({ name_en: new RegExp('^' + finalCategoryName + '$', 'i') });
        if (!catDoc) {
          // Fallback to closest match
          const keyword = finalCategoryName.split(' ')[0]; // E.g. "Living" or "Modular"
          catDoc = await Category.findOne({ name_en: new RegExp(keyword, 'i') });
        }
        if (!catDoc) {
          // Fallback to "Living Room Interiors" if not found
          catDoc = await Category.findOne({ name_en: 'Living Room Interiors' });
        }
        if (!catDoc) {
          // Or just any category
          catDoc = await Category.findOne({});
        }
        if (catDoc) {
          categoryId = catDoc._id;
          finalCategoryName = catDoc.name_en;
          finalWorkType = catDoc.workType;
        }
      }

      // 4. Translate title to Telugu if titleOverride is set
      let finalTitleTe;
      if (titleOverride) {
        const { translateToTelugu } = require('../services/aiService');
        finalTitleTe = await translateToTelugu(finalTitleEn);
      } else {
        finalTitleTe = analysis.title_te;
      }

      // 5. Generate features based on category type
      const finalFeatures = analysis.features && analysis.features.length > 0
        ? analysis.features
        : (finalWorkType === 'electrical'
            ? ['Safe Wiring', 'Load Protection', 'Energy Efficient']
            : finalWorkType === 'lighting'
            ? ['LED Lights', 'Ambient Lighting', 'Smart Control']
            : ['False Ceiling', 'Wooden Paneling', 'Modular Storage']);

      // Create new Design Card
      const newDesign = new Design({
        title_en: finalTitleEn,
        title_te: finalTitleTe,
        category: categoryId,
        subcategory: finalSubcategory,
        images: [imageUrl],
        features: finalFeatures,
        description_en: `${finalSubcategory} premium layout setup under ${finalCategoryName}.`,
        description_te: `${finalCategoryName} కింద ${finalSubcategory} ప్రీమియం లేఅవుట్ సెటప్.`,
        workType: finalWorkType,
      });

      await newDesign.save();

      // Populate and add to results
      const populated = await Design.findById(newDesign._id).populate('category', 'name_en name_te');
      results.push(populated);
    }

    res.status(201).json(results);
  } catch (error) {
    console.error('Error during bulk upload:', error);
    res.status(500).json({ message: 'Server error processing bulk upload', error: error.message });
  }
});

// @route   POST /api/designs
// @desc    Create a new design (Admin Only, Multi-image)
// @access  Private (Admin Only)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  const { title_en, title_te, category, description_en, description_te } = req.body;

  try {
    if (!title_en || !title_te || !category) {
      return res.status(400).json({ message: 'Please provide titles in both languages and select a category' });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category specified' });
    }

    // Process uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(file => processAndUploadImage(file))
      );
    }

    // Support URL text strings as manual input fallback if needed
    if (req.body.imageUrls) {
      const manualUrls = Array.isArray(req.body.imageUrls) 
        ? req.body.imageUrls 
        : [req.body.imageUrls];
      imageUrls = [...imageUrls, ...manualUrls];
    }

    if (imageUrls.length === 0) {
      // Add a fallback default placeholder image if no images uploaded
      imageUrls.push('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80');
    }

    // Save depth map if provided
    let depthMapUrl = '';
    if (req.body.depthMap) {
      depthMapUrl = await saveDepthMap(req.body.depthMap);
    }

    const newDesign = new Design({
      title_en,
      title_te,
      category,
      description_en: description_en || '',
      description_te: description_te || '',
      images: imageUrls,
      depthMap: depthMapUrl,
      workType: req.body.workType || 'interior',
    });

    await newDesign.save();
    
    // Fetch newly saved design populated with category
    const populatedDesign = await Design.findById(newDesign._id).populate('category', 'name_en name_te');
    res.status(201).json(populatedDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating design' });
  }
});

// @route   PUT /api/designs/:id
// @desc    Update an existing design (Admin Only, Multi-image)
// @access  Private (Admin Only)
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  const { title_en, title_te, category, description_en, description_te } = req.body;
  const designId = req.params.id;

  try {
    let design = await Design.findById(designId);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Validate category if updating it
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Invalid category specified' });
      }
      design.category = category;
    }

    if (title_en) design.title_en = title_en;
    if (title_te) design.title_te = title_te;
    if (description_en !== undefined) design.description_en = description_en;
    if (description_te !== undefined) design.description_te = description_te;
    if (req.body.workType) design.workType = req.body.workType;

    // Handle images: read existingImages field sent from frontend
    // It may arrive as a JSON string (FormData) or an array
    let updatedImages = [];
    if (req.body.existingImages !== undefined) {
      try {
        const parsed = typeof req.body.existingImages === 'string'
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
        updatedImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        updatedImages = design.images; // Fallback to current images on parse error
      }
    } else {
      // If no explicit keep list is sent, default to keeping current images
      updatedImages = design.images;
    }

    // Append newly uploaded images
    if (req.files && req.files.length > 0) {
      const newUrls = await Promise.all(
        req.files.map(file => processAndUploadImage(file))
      );
      updatedImages = [...updatedImages, ...newUrls];
    }

    design.images = updatedImages;

    // Save depth map if provided
    if (req.body.depthMap) {
      const depthMapUrl = await saveDepthMap(req.body.depthMap);
      if (depthMapUrl) {
        design.depthMap = depthMapUrl;
      }
    }

    await design.save();

    const populatedDesign = await Design.findById(design._id).populate('category', 'name_en name_te');
    res.json(populatedDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating design' });
  }
});


// @route   DELETE /api/designs/:id
// @desc    Delete a design
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json({ message: 'Design removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting design' });
  }
});

module.exports = router;
