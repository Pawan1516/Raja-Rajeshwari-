const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

// @route   POST /api/inquiries
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  try {
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      service,
      message,
    });

    await newInquiry.save();
    res.status(201).json(newInquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Server error saving inquiry' });
  }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries
// @access  Private (Admin Only)
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Server error retrieving inquiries' });
  }
});

// @route   PUT /api/inquiries/:id
// @desc    Mark inquiry as replied / update state
// @access  Private (Admin Only)
router.put('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.replied = true;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ message: 'Server error updating inquiry' });
  }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete an inquiry
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry removed successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Server error deleting inquiry' });
  }
});

module.exports = router;
