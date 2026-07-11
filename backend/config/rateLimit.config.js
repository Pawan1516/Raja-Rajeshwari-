module.exports = {
  // Auth Limiter Config
  auth: {
    windowMs: parseInt(process.env.AUTH_WINDOW_MS, 10) || 900000, // 15 mins
    maxPerIp: parseInt(process.env.AUTH_MAX_PER_IP, 10) || 20,
    maxPerAccount: parseInt(process.env.AUTH_MAX_PER_ACCOUNT, 10) || 10,
    
    // Backoff settings
    backoff: {
      baseMs: parseInt(process.env.AUTH_BACKOFF_BASE_MS, 10) || 1000,      // 1s
      multiplier: parseFloat(process.env.AUTH_BACKOFF_MULTIPLIER) || 2.0,
      maxMs: parseInt(process.env.AUTH_BACKOFF_MAX_MS, 10) || 900000,      // 15 mins
      resetMs: parseInt(process.env.AUTH_BACKOFF_RESET_MS, 10) || 3600000, // 1 hour
    }
  },

  // Public Limiter Config
  public: {
    windowMs: parseInt(process.env.PUBLIC_WINDOW_MS, 10) || 60000, // 1 min
    maxRequests: parseInt(process.env.PUBLIC_MAX_REQUESTS, 10) || 100,
  },

  // User Limiter Config
  user: {
    windowMs: parseInt(process.env.USER_WINDOW_MS, 10) || 60000, // 1 min
    maxRequests: parseInt(process.env.USER_MAX_REQUESTS, 10) || 300,
  }
};
