const { body, param } = require('express-validator');

const submitApplicationValidation = [
  body('job_id')
    .trim()
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid Job ID format'),

  body('name')
    .trim()
    .notEmpty().withMessage('Applicant name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('resume_link')
    .trim()
    .notEmpty().withMessage('Resume link is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Resume link must be a valid URL (http or https)'),

  body('cover_note')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Cover note cannot exceed 2000 characters'),
];

const applicationIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid application ID format'),
];

const jobIdParamValidation = [
  param('jobId')
    .isMongoId().withMessage('Invalid job ID format'),
];

module.exports = {
  submitApplicationValidation,
  applicationIdValidation,
  jobIdParamValidation,
};
