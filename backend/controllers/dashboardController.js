const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Payment = require('../models/Payment');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });
    const totalTrainers = await Trainer.countDocuments();
    
    // Calculate monthly revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = await Payment.find({
      paymentDate: { $gte: startOfMonth }
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      totalMembers,
      activeMembers,
      totalTrainers,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
