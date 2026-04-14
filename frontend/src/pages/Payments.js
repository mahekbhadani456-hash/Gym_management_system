import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  Badge,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import api from '../utils/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    planId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
  });

  useEffect(() => {
    fetchPayments();
    fetchMembers();
    fetchPlans();
    fetchPendingPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      setError('Failed to fetch payments');
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await api.get('/members');
      const membersWithPending = response.data.filter(
        member => member.paymentStatus === 'Pending'
      );
      setPendingPayments(membersWithPending);
    } catch (error) {
      console.error('Failed to fetch pending payments:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      memberId: '',
      planId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanChange = (e) => {
    const selectedPlan = plans.find((p) => p._id === e.target.value);
    setFormData({
      ...formData,
      planId: e.target.value,
      amount: selectedPlan ? selectedPlan.price : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/payments', formData);
      fetchPayments();
      fetchPendingPayments();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleMarkAsPaid = async (memberId) => {
    try {
      const member = pendingPayments.find(m => m._id === memberId);
      if (member) {
        setSelectedMember(member);
        setFormData({
          memberId: memberId,
          planId: member.planId?._id || '',
          amount: member.planId?.price || 0,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMode: 'Cash',
        });
        setShowPaymentModal(true);
      }
    } catch (error) {
      setError('Failed to open payment modal');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // First record the payment
      await api.post('/payments', formData);
      
      // Then mark member as paid
      if (selectedMember) {
        await api.put(`/members/${selectedMember._id}/payment-status`, {
          paymentStatus: 'Paid'
        });
      }
      
      fetchPayments();
      fetchPendingPayments();
      handleClosePaymentModal();
      alert('Payment recorded successfully! ✓');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedMember(null);
    setError('');
  };

  const filteredPayments = payments.filter((payment) =>
    payment.memberId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.memberId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h2 className="mb-0">💰 Payment Management</h2>
            <p className="mb-0 mt-2">Record and track all payments</p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={handleOpenModal}
              className="btn-add-new"
            >
              <span className="me-2">➕</span>
              Record Payment
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3" style={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      <Row className="g-4 mb-4">
        <Col xs={12} md={6}>
          <Card className="stat-card border-0" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 opacity-75">Total Revenue</h6>
                  <h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>₹{totalRevenue.toLocaleString()}</h2>
                </div>
                <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>💰</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card border-0" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 opacity-75">Total Payments</h6>
                  <h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{payments.length}</h2>
                </div>
                <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>📊</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Payments Section */}
      {pendingPayments.length > 0 && (
        <Card className="shadow-sm border-0 mb-4" style={{ borderLeft: '4px solid #ffc107' }}>
          <Card.Header style={{ background: '#fff8e1', borderBottom: '1px solid #ffc107' }}>
            <h5 className="mb-0 d-flex align-items-center">
              <span className="me-2">⏳</span> Pending Payments ({pendingPayments.length})
            </h5>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((member) => (
                  <tr key={member._id}>
                    <td className="fw-semibold">{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>
                      <Badge bg="info" text="dark">
                        {member.planId?.name || 'N/A'}
                      </Badge>
                    </td>
                    <td className="fw-bold">₹{member.planId?.price || 0}</td>
                    <td>{new Date(member.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleMarkAsPaid(member._id)}
                        style={{ borderRadius: '6px' }}
                      >
                        💳 Pay & Mark as Paid
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <div className="search-box">
        <InputGroup>
          <InputGroup.Text style={{ background: '#f8f9fa', borderRight: 'none' }}>
            🔍
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by member name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
          />
        </InputGroup>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Member</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th>Plan</th>
                <th>Amount (₹)</th>
                <th className="d-none d-lg-table-cell">Payment Date</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="fw-semibold">{payment.memberId?.name || 'N/A'}</td>
                    <td className="d-none d-md-table-cell">{payment.memberId?.email || 'N/A'}</td>
                    <td>
                      <span className="badge bg-info text-dark">{payment.planId?.name || 'N/A'}</span>
                    </td>
                    <td className="fw-bold">₹{payment.amount.toLocaleString()}</td>
                    <td className="d-none d-lg-table-cell">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>
                      <Badge bg="info">{payment.paymentMode}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">💰 Record New Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Member *</Form.Label>
                  <Form.Select
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} - {member.email}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan *</Form.Label>
                  <Form.Select
                    name="planId"
                    value={formData.planId}
                    onChange={handlePlanChange}
                    required
                  >
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name} - ₹{plan.price} ({plan.duration})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Payment Mode *</Form.Label>
              <Form.Select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
              style={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                color: 'white'
              }}
            >
              💾 Record Payment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Payment Modal for Pending Payments */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">💳 Make Payment - {selectedMember?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePaymentSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* Member Info */}
            <Card className="mb-3" style={{ background: '#f8f9fa' }}>
              <Card.Body className="py-2">
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Member</small>
                    <div className="fw-semibold">{selectedMember?.name}</div>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Email</small>
                    <div>{selectedMember?.email}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Member *</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedMember?.name || ''}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan *</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedMember?.planId?.name || 'N/A'}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                  />
                  <Form.Text className="text-muted">
                    Plan price: ₹{selectedMember?.planId?.price || 0}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Payment Mode *</Form.Label>
              <Form.Select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                required
              >
                <option value="Cash">💵 Cash</option>
                <option value="UPI">📱 UPI</option>
                <option value="Card">💳 Card</option>
                <option value="Bank Transfer">🏦 Bank Transfer</option>
                <option value="Other">📝 Other</option>
              </Form.Select>
            </Form.Group>

            <Alert variant="info" className="mb-0">
              <strong>Note:</strong> This will record the payment and mark the member as Paid.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleClosePaymentModal}
              style={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                color: 'white'
              }}
            >
              ✓ Confirm Payment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;

