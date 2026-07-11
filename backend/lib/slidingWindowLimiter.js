const store = require('./store');

/**
 * Checks if a request is allowed under a sliding window limit.
 * @param {object} params
 * @param {string} params.key - Key identifying the client (IP or account)
 * @param {number} params.windowMs - Sliding window duration in milliseconds
 * @param {number} params.maxRequests - Maximum allowed requests in the window
 * @returns {Promise<{ allowed: boolean, remaining: number, resetMs: number }>}
 */
const checkSlidingWindow = async ({ key, windowMs, maxRequests }) => {
  const now = Date.now();
  const cutoff = now - windowMs;

  let timestamps = store.get(key) || [];

  // Filter out timestamps outside the current sliding window
  timestamps = timestamps.filter(t => t > cutoff);

  if (timestamps.length >= maxRequests) {
    const oldestTimestamp = timestamps[0];
    const msRemaining = oldestTimestamp + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, msRemaining)
    };
  }

  // Register the new request timestamp
  timestamps.push(now);
  // Store the request timestamps array with a TTL matching the window duration
  store.set(key, timestamps, windowMs);

  return {
    allowed: true,
    remaining: maxRequests - timestamps.length,
    resetMs: windowMs
  };
};

module.exports = {
  checkSlidingWindow
};
