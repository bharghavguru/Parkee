const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Page 1: Sign Up Route
router.post('/signup', AuthController.signup);

// View all registered users (Development API)
router.get('/users', AuthController.getUsers);

module.exports = router;
