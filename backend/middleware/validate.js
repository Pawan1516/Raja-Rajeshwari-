const { z } = require('zod');

/**
 * Validates request body, query, and params against strict Zod schemas.
 * Rejects with a 400 Bad Request containing field-level details on failure.
 * Does not silently strip or sanitize; instead rejects anything that does not match.
 * Extra/unexpected fields should be blocked via calling .strict() on Zod object schemas.
 * 
 * @param {object} schemas - Object containing Zod schemas for body, query, and/or params
 * @returns {Function} Express middleware
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.errors || error.issues || [];
        const fieldErrors = issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          error: 'Input validation failed',
          details: fieldErrors
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
