const express = require('express');
const router = express.Router();

const {
  submitApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
  getMyApplications,
} = require('../controllers/applicationController');

const {
  submitApplicationValidation,
  applicationIdValidation,
} = require('../validators/applicationValidators');

const { handleValidationErrors } = require('../middleware/validateRequest');
const { requireAdmin } = require('../middleware/adminAuth');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Job Seeker: view own applications (must come before /:id)
router.get('/my', protect, restrictTo('jobseeker'), getMyApplications);

// Protected: must be logged in as jobseeker to apply
router.post(
  '/',
  protect,
  restrictTo('jobseeker'),
  submitApplicationValidation,
  handleValidationErrors,
  submitApplication
);

// Admin routes
router.get('/', requireAdmin, listApplications);

router.get(
  '/:id',
  requireAdmin,
  applicationIdValidation,
  handleValidationErrors,
  getApplicationById
);

router.patch(
  '/:id/status',
  requireAdmin,
  applicationIdValidation,
  handleValidationErrors,
  updateApplicationStatus
);

module.exports = router;
