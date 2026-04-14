const mongoose = require('mongoose');
const Trainer = require('./models/Trainer');
require('dotenv').config();

const connectDB = require('./config/database');

const updateTrainerFees = async () => {
  try {
    await connectDB();
    
    // Update trainers with sample fees
    const trainers = await Trainer.find();
    
    const feeStructure = {
      'Weight Loss': 5000,
      'Muscle Gain': 6000,
      'Yoga': 4000,
      'Cardio': 4500,
      'Strength Training': 7000,
      'CrossFit': 8000
    };
    
    for (let trainer of trainers) {
      const fee = feeStructure[trainer.specialization] || 5000;
      
      if (!trainer.fees || trainer.fees === 0) {
        trainer.fees = fee;
        await trainer.save();
        console.log(`✓ Updated ${trainer.name} (${trainer.specialization}) - Fees: ₹${fee}`);
      }
    }
    
    console.log('\n✅ All trainers updated with fees!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateTrainerFees();
