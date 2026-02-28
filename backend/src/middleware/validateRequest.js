const { validationResult } = require('express-validator');

/**
 * Middleware to handle express-validator validation results.
 * Sends a 400 response with all validation errors if any exist.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = { handleValidationErrors };
