import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Button, Modal, Form } from 'react-bootstrap';
import api from '../utils/api';

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [planPrice, setPlanPrice] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentType: 'full',
    paymentMode: 'Cash'
  });
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [member, setMember] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/user/my-payments');
      setPayments(response.data.payments);
      setTotalPaid(response.data.totalPaid);
      setPlanPrice(response.data.planPrice);
      setPendingAmount(response.data.pendingAmount);
      setMember(response.data.member);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
    setPaymentSuccess('');
    setPaymentError('');
    setPaymentData({
      paymentType: 'full',
      paymentMode: 'Cash'
    });
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess('');
    setPaymentError('');
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentSuccess('');

    try {
      const response = await api.post('/payments/user/make-payment', paymentData);
      setPaymentSuccess(response.data.message);
      
      // Refresh payment data
      setTimeout(() => {
        handleClosePaymentModal();
        fetchPayments();
      }, 2000);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>💳 My Payments</h2>
        <p className="text-muted">View your payment history and pending amounts</p>
      </div>

      {/* Payment Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted mb-2">Total Plan Price</Card.Title>
              <h2 className="mb-0">₹{planPrice.toLocaleString('en-IN')}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted mb-2">Total Paid</Card.Title>
              <h2 className="mb-0 text-success">₹{totalPaid.toLocaleString('en-IN')}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className={`shadow-sm ${pendingAmount > 0 ? 'border-warning' : ''}`}>
            <Card.Body>
              <Card.Title className="text-muted mb-2">Pending Amount</Card.Title>
              <h2 className={`mb-0 ${pendingAmount > 0 ? 'text-danger' : 'text-success'}`}>
                ₹{pendingAmount.toLocaleString('en-IN')}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Payment Notification */}
      {pendingAmount > 0 && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-start">
            <span className="me-2" style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <Alert.Heading>Half Payment Pending!</Alert.Heading>
              <p className="mb-1">
                You have a pending payment of <strong>₹{pendingAmount.toLocaleString('en-IN')}</strong> for your current plan.
              </p>
              <p className="mb-0">
                Please complete your payment to avoid any service interruption.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {pendingAmount === 0 && planPrice > 0 && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-start">
            <span className="me-2" style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <Alert.Heading>Payment Successful!</Alert.Heading>
              <p className="mb-0">
                You have paid the full amount for your current plan. Thank you!
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Make Payment Button */}
      {member && pendingAmount > 0 && (
        <Row className="mb-4">
          <Col className="text-end">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleOpenPaymentModal}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                padding: '12px 32px'
              }}
            >
              💳 Make Payment
            </Button>
          </Col>
        </Row>
      )}

      {/* Payment History */}
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">📋 Payment History</h5>
        </Card.Header>
        <Card.Body>
          {payments.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td className="fw-semibold">{payment.planId?.name || 'N/A'}</td>
                    <td className="fw-bold text-success">₹{payment.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <Badge bg="info">{payment.paymentMode}</Badge>
                    </td>
                    <td>
                      <Badge bg={payment.status === 'completed' ? 'success' : 'warning'}>
                        {payment.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem' }} className="mb-3">💳</div>
              <h5 className="text-muted">No Payment History</h5>
              <p className="text-muted">You haven't made any payments yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered backdrop="static">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">💳 Make Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePaymentSubmit}>
          <Modal.Body>
            {paymentSuccess && <Alert variant="success">{paymentSuccess}</Alert>}
            {paymentError && <Alert variant="danger">{paymentError}</Alert>}

            <Alert variant="info" className="mb-3">
              <strong>Plan Price:</strong> ₹{planPrice.toLocaleString('en-IN')}
              <br />
              <strong>Pending Amount:</strong> ₹{pendingAmount.toLocaleString('en-IN')}
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Payment Type *</Form.Label>
              <Form.Select 
                name="paymentType" 
                value={paymentData.paymentType} 
                onChange={handlePaymentChange} 
                required
              >
                <option value="full">Full Payment (₹{planPrice.toLocaleString('en-IN')})</option>
                <option value="half">Half Payment (₹{(planPrice / 2).toLocaleString('en-IN')})</option>
              </Form.Select>
              <Form.Text className="text-muted">
                {paymentData.paymentType === 'half' 
                  ? '⚠️ Half payment will be marked as pending'
                  : '✓ Full payment will complete your dues'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Mode *</Form.Label>
              <Form.Select 
                name="paymentMode" 
                value={paymentData.paymentMode} 
                onChange={handlePaymentChange} 
                required
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </Form.Select>
            </Form.Group>

            <Alert variant={paymentData.paymentType === 'half' ? 'warning' : 'success'} className="mb-0">
              <strong>{paymentData.paymentType === 'half' ? '⚠️ Note:' : '✓ Confirmation:'}</strong>
              {paymentData.paymentType === 'half' 
                ? ' Your payment status will be "Half payment pending". Please complete the remaining payment soon.'
                : ' Your payment status will be "Payment successful". All dues cleared!'}
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
              💰 Pay Now
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPayments;
