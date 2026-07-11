const config = require('../config/rateLimit.config');
const { checkSlidingWindow } = require('../lib/slidingWindowLimiter');
const backoffLimiter = require('../lib/backoffLimiter');

/**
 * Public Limiter: Moderate IP-based sliding window flood limiter.
 */
const publicLimiter = () => {
  return async (req, res, next) => {
    const ip = req.ip;
    const key = `limit:public:${ip}`;
    const windowMs = config.public.windowMs;
    const maxRequests = config.public.maxRequests;

    try {
      const result = await checkSlidingWindow({ key, windowMs, maxRequests });

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000));

      if (!result.allowed) {
        const retryAfter = Math.ceil(result.resetMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Too many requests, please try again later.',
          retryAfterSeconds: retryAfter
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * User Limiter: Account-based sliding window loose limiter for authenticated routes.
 */
const userLimiter = () => {
  return async (req, res, next) => {
    // Determine user identifier. If unauthenticated, fallback to IP.
    const userId = req.user ? (req.user.id || req.user._id || req.user.username) : req.ip;
    const key = `limit:user:${userId}`;
    const windowMs = config.user.windowMs;
    const maxRequests = config.user.maxRequests;

    try {
      const result = await checkSlidingWindow({ key, windowMs, maxRequests });

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000));

      if (!result.allowed) {
        const retryAfter = Math.ceil(result.resetMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Rate limit exceeded. Please slow down.',
          retryAfterSeconds: retryAfter
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Auth Limiter: IP & Account sliding window flood limits AND progressive backoff delays.
 */
const authLimiter = (options = {}) => {
  const accountKeyExtractor = options.accountKeyExtractor || ((req) => req.body.email || req.body.username);

  return async (req, res, next) => {
    const ip = req.ip;
    const account = accountKeyExtractor(req) || 'anonymous';

    const ipFloodKey = `limit:auth:flood:ip:${ip}`;
    const accountFloodKey = `limit:auth:flood:account:${account}`;

    const ipBackoffKey = `limit:auth:backoff:ip:${ip}`;
    const accountBackoffKey = `limit:auth:backoff:account:${account}`;

    try {
      // 1. Check progressive backoff delays first (only if failures exist)
      const ipBackoff = backoffLimiter.checkBackoff(ipBackoffKey, config.auth.backoff);
      if (!ipBackoff.allowed) {
        const retryAfter = Math.ceil(ipBackoff.retryAfterMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Too many failed attempts. Please wait before trying again.',
          retryAfterSeconds: retryAfter,
          retryAfterMs: ipBackoff.retryAfterMs
        });
      }

      const accountBackoff = backoffLimiter.checkBackoff(accountBackoffKey, config.auth.backoff);
      if (!accountBackoff.allowed) {
        const retryAfter = Math.ceil(accountBackoff.retryAfterMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Too many failed attempts on this account. Please wait before trying again.',
          retryAfterSeconds: retryAfter,
          retryAfterMs: accountBackoff.retryAfterMs
        });
      }

      // 2. Check sliding window flood limits
      const ipFlood = await checkSlidingWindow({
        key: ipFloodKey,
        windowMs: config.auth.windowMs,
        maxRequests: config.auth.maxPerIp
      });
      if (!ipFlood.allowed) {
        const retryAfter = Math.ceil(ipFlood.resetMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Too many authentication attempts from this IP. Please try again later.',
          retryAfterSeconds: retryAfter
        });
      }

      const accountFlood = await checkSlidingWindow({
        key: accountFloodKey,
        windowMs: config.auth.windowMs,
        maxRequests: config.auth.maxPerAccount
      });
      if (!accountFlood.allowed) {
        const retryAfter = Math.ceil(accountFlood.resetMs / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'Too many authentication attempts on this account. Please try again later.',
          retryAfterSeconds: retryAfter
        });
      }

      // 3. Attach Rate Limit controllers so routes can report outcomes
      req.authRateLimit = {
        recordSuccess: () => {
          backoffLimiter.recordSuccess(ipBackoffKey);
          backoffLimiter.recordSuccess(accountBackoffKey);
        },
        recordFailure: () => {
          backoffLimiter.recordFailure(ipBackoffKey, config.auth.backoff);
          backoffLimiter.recordFailure(accountBackoffKey, config.auth.backoff);
        }
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  publicLimiter,
  userLimiter,
  authLimiter
};
