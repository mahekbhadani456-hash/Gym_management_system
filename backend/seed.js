const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const Plan = require('./models/Plan');
const Payment = require('./models/Payment');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mahekbhadani456_db_user:1234@gym.h2yn0ye.mongodb.net/?appName=Gym');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Member.deleteMany({});
    await Trainer.deleteMany({});
    await Plan.deleteMany({});
    await Payment.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@gym.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user');

    // Create membership plans
    const plans = await Plan.insertMany([
      {
        name: 'Basic Plan',
        duration: '1 month',
        price: 1500,
        description: 'Access to gym facilities, basic equipment',
      },
      {
        name: 'Standard Plan',
        duration: '3 months',
        price: 4000,
        description: 'Access to gym facilities, all equipment, group classes',
      },
      {
        name: 'Premium Plan',
        duration: '6 months',
        price: 7500,
        description: 'Full access, personal trainer sessions, nutrition guidance',
      },
      {
        name: 'Elite Plan',
        duration: '12 months',
        price: 14000,
        description: 'All premium features, priority booking, spa access',
      },
    ]);
    console.log('Created membership plans');

    // Create trainers
    const trainers = await Trainer.insertMany([
      {
        name: 'John Smith',
        specialization: 'Weight Training',
        phone: '9876543210',
        experience: 5,
        status: 'Active',
      },
      {
        name: 'Sarah Johnson',
        specialization: 'Yoga & Pilates',
        phone: '9876543211',
        experience: 8,
        status: 'Active',
      },
      {
        name: 'Mike Davis',
        specialization: 'Cardio & HIIT',
        phone: '9876543212',
        experience: 4,
        status: 'Active',
      },
      {
        name: 'Emma Wilson',
        specialization: 'Strength & Conditioning',
        phone: '9876543213',
        experience: 6,
        status: 'Active',
      },
    ]);
    console.log('Created trainers');

    // Create members
    const joinDate = new Date();
    const expiryDate1 = new Date(joinDate);
    expiryDate1.setMonth(expiryDate1.getMonth() + 1);
    
    const expiryDate3 = new Date(joinDate);
    expiryDate3.setMonth(expiryDate3.getMonth() + 3);

    const members = await Member.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9123456789',
        age: 28,
        gender: 'Male',
        planId: plans[0]._id,
        joinDate: joinDate,
        expiryDate: expiryDate1,
        status: 'Active',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9123456790',
        age: 25,
        gender: 'Female',
        planId: plans[1]._id,
        joinDate: joinDate,
        expiryDate: expiryDate3,
        status: 'Active',
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '9123456791',
        age: 32,
        gender: 'Male',
        planId: plans[2]._id,
        joinDate: joinDate,
        expiryDate: new Date(joinDate.getTime() + 180 * 24 * 60 * 60 * 1000),
        status: 'Active',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '9123456792',
        age: 30,
        gender: 'Female',
        planId: plans[3]._id,
        joinDate: joinDate,
        expiryDate: new Date(joinDate.getTime() + 365 * 24 * 60 * 60 * 1000),
        status: 'Active',
      },
    ]);
    console.log('Created members');

    // Create payments
    await Payment.insertMany([
      {
        memberId: members[0]._id,
        planId: plans[0]._id,
        amount: 1500,
        paymentDate: joinDate,
        paymentMode: 'Cash',
      },
      {
        memberId: members[1]._id,
        planId: plans[1]._id,
        amount: 4000,
        paymentDate: joinDate,
        paymentMode: 'UPI',
      },
      {
        memberId: members[2]._id,
        planId: plans[2]._id,
        amount: 7500,
        paymentDate: joinDate,
        paymentMode: 'Card',
      },
      {
        memberId: members[3]._id,
        planId: plans[3]._id,
        amount: 14000,
        paymentDate: joinDate,
        paymentMode: 'UPI',
      },
    ]);
    console.log('Created payments');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin@gym.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

