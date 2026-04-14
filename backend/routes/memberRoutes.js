const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  updatePaymentStatus,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getMembers).post(protect, createMember);
router.route('/:id').get(protect, getMember).put(protect, updateMember).delete(protect, deleteMember);
router.route('/:id/payment-status').put(protect, updatePaymentStatus);

module.exports = router;

