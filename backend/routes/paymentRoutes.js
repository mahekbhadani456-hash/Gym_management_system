const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPayment,
  createPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getPayments).post(protect, createPayment);
router.route('/:id').get(protect, getPayment);

module.exports = router;

