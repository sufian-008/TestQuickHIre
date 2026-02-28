const express = require('express');
const router = express.Router();

const { register, login, getMe, updateMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const { handleValidationErrors } = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);

// Protected routes (JWT required)
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

module.exports = router;
