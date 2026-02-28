const express = require('express');
const router = express.Router();

const {
  listJobs,
  getJobById,
  createJob,
  deleteJob,
  getJobApplications,
} = require('../controllers/jobController');

const {
  createJobValidation,
  listJobsValidation,
  jobIdValidation,
} = require('../validators/jobValidators');

const { jobIdParamValidation } = require('../validators/applicationValidators');
const { handleValidationErrors } = require('../middleware/validateRequest');
const { requireAdmin } = require('../middleware/adminAuth');

// Public routes
router.get('/', listJobsValidation, handleValidationErrors, listJobs);
router.get('/:id', jobIdValidation, handleValidationErrors, getJobById);

// Admin routes
router.post(
  '/',
  requireAdmin,
  createJobValidation,
  handleValidationErrors,
  createJob
);

router.delete(
  '/:id',
  requireAdmin,
  jobIdValidation,
  handleValidationErrors,
  deleteJob
);

router.get(
  '/:jobId/applications',
  requireAdmin,
  jobIdParamValidation,
  handleValidationErrors,
  getJobApplications
);

module.exports = router;
