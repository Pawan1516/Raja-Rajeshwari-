const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @route   POST /api/admin/login
// @desc    Admin login & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Validate password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Sign JWT Token
    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'rliw_dev_jwt_secret_key_123',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
