const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public or protected? The user said "summary... where i can see". 
// Usually market stats can be public, but let's keep it protected for now as all other routes are role-based.
// Actually, let's make it open to any authenticated user.
router.get('/', authMiddleware, statsController.getMarketStats);

module.exports = router;
