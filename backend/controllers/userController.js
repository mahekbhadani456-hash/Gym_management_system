const User = require('../models/User');
const Member = require('../models/Member');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username: name,
      email,
      password,
      role: 'user'
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response without password
    res.status(201).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response without password
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.username = req.body.name || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's member details
// @route   GET /api/users/member
// @access  Private
const getUserMemberDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('memberId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.memberId) {
      return res.status(404).json({ message: 'Member details not found' });
    }

    res.json(user.memberId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/users/registered
// @access  Private/Admin
const getAllRegisteredUsers = async (req, res) => {
  try {
    // Get all users with role 'user' (not admin)
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('memberId', 'name email planId joinDate expiryDate status')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve user and create member record
// @route   POST /api/users/:userId/approve
// @access  Private/Admin
const approveUserAsMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId, joinDate, expiryDate, status = 'Active' } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    if (user.memberId) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Create member record
    const member = await Member.create({
      name: user.username,
      email: user.email,
      phone: req.body.phone || 'Not provided',
      age: req.body.age || 25,
      gender: req.body.gender || 'Male',
      planId,
      joinDate: joinDate || new Date(),
      expiryDate,
      status,
      userId: user._id
    });

    // Update user with memberId
    user.memberId = member._id;
    await user.save();

    // Populate the member data
    const updatedUser = await User.findById(userId)
      .populate('memberId', 'name email planId joinDate expiryDate status');

    res.json({
      message: 'User approved and added as member successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get pending users (not yet members)
// @route   GET /api/users/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    // Get users who don't have memberId yet
    const users = await User.find({ 
      role: 'user',
      memberId: null 
    })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll user as member (User request)
// @route   POST /api/users/enroll
// @access  Private
const enrollUserAsMember = async (req, res) => {
  try {
    const { phone, age, gender, planId, joinDate } = req.body;
    
    // Find the current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    if (user.memberId) {
      return res.status(400).json({ message: 'You are already a member' });
    }

    // Create pending enrollment record (will be approved by admin)
    // For now, directly create member and link to user
    const member = await Member.create({
      name: user.username,
      email: user.email,
      phone,
      age: parseInt(age),
      gender,
      planId,
      joinDate: joinDate || new Date(),
      expiryDate: calculateExpiryDate(joinDate, planId),
      status: 'Active',
      userId: user._id
    });

    // Update user with memberId
    user.memberId = member._id;
    await user.save();

    res.json({
      message: 'Enrollment successful! You are now a gym member.',
      member
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to calculate expiry date based on plan
const calculateExpiryDate = (joinDateStr, planId) => {
  const Plan = require('../models/Plan');
  // This is simplified - in production, fetch plan details
  const joinDate = new Date(joinDateStr);
  const expiry = new Date(joinDate);
  
  // Default to 1 month if plan not found
  expiry.setMonth(expiry.getMonth() + 1);
  
  return expiry;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserMemberDetails,
  getAllRegisteredUsers,
  approveUserAsMember,
  getPendingUsers,
  enrollUserAsMember
};