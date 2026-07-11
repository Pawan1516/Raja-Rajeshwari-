const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const Admin = require('../models/Admin');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');
const auth = require('../middleware/auth');

// Define strict schema for login
const loginSchema = {
  body: z.object({
    username: z.string({ required_error: 'Username is required' })
               .min(3, 'Username must be at least 3 characters')
               .max(50, 'Username must be at most 50 characters'),
    password: z.string({ required_error: 'Password is required' })
               .min(6, 'Password must be at least 6 characters')
               .max(100, 'Password must be at most 100 characters')
  }).strict('Unexpected/extra fields in the request body are not allowed')
};

// @route   POST /api/admin/login
// @desc    Admin login & get token
// @access  Public
router.post('/login', authLimiter(), validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      req.authRateLimit.recordFailure(); // Escalate progressive backoff delay
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Validate password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.authRateLimit.recordFailure(); // Escalate progressive backoff delay
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Sign JWT Token
    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'rliw_dev_jwt_secret_key_123',
      { expiresIn: '6h' }
    );

    req.authRateLimit.recordSuccess(); // Reset backoff delay on success

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        image: admin.image || '/uploads/admin-avatar.png'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/admin/refresh
// @desc    Refresh admin token (extends session by 6h)
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'rliw_dev_jwt_secret_key_123',
      { expiresIn: '6h' }
    );
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        image: admin.image || '/uploads/admin-avatar.png'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

module.exports = router;

