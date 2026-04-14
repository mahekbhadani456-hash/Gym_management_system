const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} = require('../controllers/planController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getPlans).post(protect, createPlan);
router.route('/:id').get(protect, getPlan).put(protect, updatePlan).delete(protect, deletePlan);

module.exports = router;

