const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if admin
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

router.use(authMiddleware);
router.use(adminCheck);

router.get('/pending-users', adminController.getPendingUsers);
router.put('/approve/:id', adminController.approveUser);
router.delete('/reject/:id', adminController.rejectUser);

module.exports = router;
