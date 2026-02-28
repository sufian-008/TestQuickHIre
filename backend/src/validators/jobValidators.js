const { body, query, param } = require('express-validator');

const validCategories = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'HR',
  'Operations',
  'Product',
  'Data',
  'Other',
];

const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const createJobValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(', ')}`),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),

  body('salary')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Salary field cannot exceed 100 characters'),

  body('type')
    .optional()
    .trim()
    .isIn(validTypes).withMessage(`Type must be one of: ${validTypes.join(', ')}`),
];

const listJobsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .isIn(validCategories).withMessage(`Category must be one of: ${validCategories.join(', ')}`),

  query('type')
    .optional()
    .isIn(validTypes).withMessage(`Type must be one of: ${validTypes.join(', ')}`),
];

const jobIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid job ID format'),
];

module.exports = {
  createJobValidation,
  listJobsValidation,
  jobIdValidation,
};
