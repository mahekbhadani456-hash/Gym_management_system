const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getTrainers).post(protect, createTrainer);
router.route('/:id').get(protect, getTrainer).put(protect, updateTrainer).delete(protect, deleteTrainer);

module.exports = router;

