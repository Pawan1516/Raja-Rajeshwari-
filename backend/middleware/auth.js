const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header (Format: Bearer <token>)
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(418).json({ message: 'No authorization header found. Access denied.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rliw_dev_jwt_secret_key_123');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Authorization failed.' });
  }
};
