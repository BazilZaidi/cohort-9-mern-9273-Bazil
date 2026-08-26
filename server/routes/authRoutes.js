// const express = require('express');
// const router = express.Router();
// const { signup, login } = require('../controllers/authController');

// router.post('/signup', signup);
// router.post('/login', login);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { signup, login, updateProfile, getProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;