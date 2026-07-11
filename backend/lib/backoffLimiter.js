const store = require('./store');

/**
 * Retrieves the current backoff state for a given key.
 * If the reset period has elapsed since the last failed attempt, it resets the backoff state.
 * @param {string} key 
 * @param {object} config 
 * @returns {object} state
 */
const getBackoffState = (key, config) => {
  const { resetMs } = config;
  const now = Date.now();
  
  let state = store.get(key);
  
  // Clear backoff state if the reset threshold of quiet time has been met
  if (state && now - state.lastAttempt > resetMs) {
    store.delete(key);
    state = null;
  }
  
  if (!state) {
    return {
      failures: 0,
      lastAttempt: 0,
      backoffMs: 0
    };
  }
  
  return state;
};

/**
 * Checks if the backoff delay is currently active for a key.
 * @param {string} key 
 * @param {object} config 
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
const checkBackoff = (key, config) => {
  const state = getBackoffState(key, config);
  const now = Date.now();
  
  if (state.backoffMs > 0) {
    const elapsed = now - state.lastAttempt;
    if (elapsed < state.backoffMs) {
      return {
        allowed: false,
        retryAfterMs: state.backoffMs - elapsed
      };
    }
  }
  
  return {
    allowed: true,
    retryAfterMs: 0
  };
};

/**
 * Records a failure, incrementing the consecutive failure count and doubling the backoff delay.
 * @param {string} key 
 * @param {object} config 
 * @returns {object} new backoff state
 */
const recordFailure = (key, config) => {
  const state = getBackoffState(key, config);
  const { baseMs, multiplier, maxMs, resetMs } = config;
  const now = Date.now();
  
  const failures = state.failures + 1;
  // Calculate exponential delay: base * multiplier^(failures - 1)
  const backoffMs = Math.min(baseMs * Math.pow(multiplier, failures - 1), maxMs);
  
  const newState = {
    failures,
    lastAttempt: now,
    backoffMs
  };
  
  // Store the backoff details with TTL set to resetMs
  store.set(key, newState, resetMs);
  return newState;
};

/**
 * Clears the backoff state immediately on success.
 * @param {string} key 
 */
const recordSuccess = (key) => {
  store.delete(key);
};

module.exports = {
  checkBackoff,
  recordFailure,
  recordSuccess
};
