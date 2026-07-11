class MemoryStore {
  constructor() {
    this.store = new Map();
  }

  /**
   * Retrieves a value from the store. 
   * If the key is expired, it deletes the key and returns null.
   * @param {string} key 
   * @returns {*} value or null
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Sets a value in the store with a given TTL.
   * @param {string} key 
   * @param {*} value 
   * @param {number} ttlMs time-to-live in milliseconds
   */
  set(key, value, ttlMs) {
    const expiry = Date.now() + ttlMs;
    this.store.set(key, { value, expiry });
  }

  /**
   * Deletes a key from the store.
   * @param {string} key 
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Cleans up all expired entries in the store.
   * Useful to call periodically or in tests to avoid memory build-up.
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        this.store.delete(key);
      }
    }
  }
}

// Export a single instance to share the in-memory store across limiters
module.exports = new MemoryStore();
