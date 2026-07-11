const express = require('express');
const { authLimiter, publicLimiter, userLimiter } = require('../middleware/rateLimit');

const app = express();
app.use(express.json());

// Tell Express to trust the first proxy hop (essential for rate limiting)
app.set('trust proxy', 1);

// Mock checkCredentials logic
const checkCredentials = (email, password) => {
  return email === 'admin@rliw.com' && password === 'admin123';
};

// 1. Auth route login (exponential backoff on failure)
app.post('/auth/login', authLimiter(), (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const ok = checkCredentials(email, password);

  if (!ok) {
    req.authRateLimit.recordFailure(); // Escalate progressive backoff delay
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.authRateLimit.recordSuccess(); // Clear delay immediately on success
  res.json({ token: 'mock_jwt_token_auth_success' });
});

// 2. Public route
app.get('/public/listings', publicLimiter(), (req, res) => {
  res.json({ message: 'Welcome to the public listings showroom! Request allowed.' });
});

// 3. User authenticated route (loose account limiting)
// Mock authentication middleware
const requireAuth = (req, res, next) => {
  req.user = { id: 'user_1001', username: 'raja_developer' };
  next();
};

app.get('/me/profile', requireAuth, userLimiter(), (req, res) => {
  res.json({ message: 'Authenticated user profile retrieved successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rate Limiting Demonstration app running on port ${PORT}`);
  console.log(`POST /auth/login -> authLimiter() (IP + account floor limit + progressive exponential backoff)`);
  console.log(`GET  /public/listings -> publicLimiter() (IP floor limit)`);
  console.log(`GET  /me/profile -> userLimiter() (Account floor limit)`);
});

module.exports = app;
