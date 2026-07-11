const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const { upload, isCloudinaryConfigured, processAndUploadImage } = require('../config/cloudinary');

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ createdAt: 1 });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving team members' });
  }
});

// @route   POST /api/team
// @desc    Create a team member
// @access  Private (Admin Only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, role, role_te, exp } = req.body;

  try {
    if (!name || !role || !role_te || !exp) {
      return res.status(400).json({ message: 'Please provide name, role (English/Telugu), and experience' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await processAndUploadImage(req.file);
    } else {
      imageUrl = req.body.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
    }

    const newMember = new TeamMember({
      name,
      role,
      role_te,
      exp,
      image: imageUrl
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating team member' });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete a team member
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting team member' });
  }
});

// @route   PUT /api/team/:id
// @desc    Update a team member
// @access  Private (Admin Only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const { name, role, role_te, exp } = req.body;
    if (name) member.name = name;
    if (role) member.role = role;
    if (role_te) member.role_te = role_te;
    if (exp) member.exp = exp;

    if (req.file) {
      member.image = await processAndUploadImage(req.file);
    }

    await member.save();
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating team member' });
  }
});

module.exports = router;
