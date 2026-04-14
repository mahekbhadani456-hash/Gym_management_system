const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate('planId', 'name duration price')
      .sort({ createdAt: -1 });
    
    // Calculate payment status based on payments
    const membersWithPaymentStatus = await Promise.all(
      members.map(async (member) => {
        const memberObj = member.toObject();
        
        // Check if there's a payment for this member for the current plan
        const Payment = require('../models/Payment');
        const latestPayment = await Payment.findOne({ 
          memberId: member._id 
        }).sort({ paymentDate: -1 });
        
        if (latestPayment && latestPayment.planId.toString() === member.planId._id.toString()) {
          memberObj.paymentStatus = 'Paid';
        } else {
          memberObj.paymentStatus = 'Pending';
        }
        
        return memberObj;
      })
    );
    
    res.json(membersWithPaymentStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('planId', 'name duration price');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private
const createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    const populatedMember = await Member.findById(member._id).populate('planId', 'name duration price');
    res.status(201).json(populatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('planId', 'name duration price');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update member payment status
// @route   PUT /api/members/:id/payment-status
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus || !['Paid', 'Pending'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    ).populate('planId', 'name duration price');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  updatePaymentStatus
};

