const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  getUserMemberDetails,
  getAllRegisteredUsers,
  approveUserAsMember,
  getPendingUsers,
  enrollUserAsMember
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Protected routes
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router.route('/member').get(protect, getUserMemberDetails);
router.route('/enroll').post(protect, enrollUserAsMember);

// Admin routes
router.route('/registered').get(protect, getAllRegisteredUsers);
router.route('/pending').get(protect, getPendingUsers);
router.route('/:userId/approve').post(protect, approveUserAsMember);

module.exports = router;