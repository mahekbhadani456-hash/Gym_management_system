import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Alert, Modal } from 'react-bootstrap';
import api from '../utils/api';

const UserPlans = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [enrollData, setEnrollData] = useState({
    phone: '',
    age: '',
    gender: 'Male',
    planId: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [enrollSuccess, setEnrollSuccess] = useState('');
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userResponse = await api.get('/users/profile');
        setUser(userResponse.data);

        // Get user member details
        try {
          const memberResponse = await api.get('/users/member');
          setMember(memberResponse.data);
        } catch (error) {
          console.log('User does not have member details yet');
        }

        // Get all plans
        const plansResponse = await api.get('/plans');
        setPlans(plansResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleOpenEnrollModal = (plan) => {
    setSelectedPlan(plan);
    setEnrollData({
      ...enrollData,
      planId: plan._id
    });
    setShowEnrollModal(true);
    setEnrollSuccess('');
    setEnrollError('');
  };

  const handleCloseEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedPlan(null);
    setEnrollSuccess('');
    setEnrollError('');
  };

  const handleEnrollChange = (e) => {
    setEnrollData({
      ...enrollData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setEnrollError('');
    setEnrollSuccess('');

    try {
      // Send enrollment request to backend
      await api.post('/users/enroll', enrollData);
      
      setEnrollSuccess('Your enrollment request has been sent to admin for approval! You will become a member once admin approves.');
      setTimeout(() => {
        handleCloseEnrollModal();
      }, 3000);
    } catch (error) {
      setEnrollError(error.response?.data?.message || 'Failed to submit enrollment request');
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h2 className="mb-0">📋 My Plans & Subscriptions</h2>
            <p className="mb-0 mt-2">View your current and available gym plans</p>
          </div>
        </div>
      </div>

      {/* Current Membership Card */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">💳</span> Current Membership
              </h5>
            </Card.Header>
            <Card.Body>
              {member ? (
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Plan:</strong>
                        <span className="fw-semibold">{member.planId?.name}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Duration:</strong>
                        <span>{member.planId?.duration}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Price:</strong>
                        <span>₹{member.planId?.price}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Join Date:</strong>
                        <span>{formatDate(member.joinDate)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Expiry Date:</strong>
                        <span>{formatDate(member.expiryDate)}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column h-100 justify-content-center">
                      <div className="mb-2">
                        <Badge bg={member.status === 'Active' ? 'success' : 'secondary'} className="fs-6 px-3 py-2 w-100">
                          {member.status}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <small className="text-muted">
                          {new Date(member.expiryDate) > new Date()
                            ? `${Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                            : 'Membership expired'}
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="text-center py-3">
                  <p className="mb-3">You don't have an active membership yet.</p>
                  <Button variant="outline-primary" disabled>
                    Contact Admin to Enroll
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Plans Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">📋</span> Available Plans
              </h5>
            </Card.Header>
            <Card.Body>
              {plans.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th className="d-none d-md-table-cell">Duration</th>
                      <th>Price</th>
                      <th className="d-none d-lg-table-cell">Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id}>
                        <td>
                          <div className="fw-semibold">{plan.name}</div>
                        </td>
                        <td className="d-none d-md-table-cell">{plan.duration}</td>
                        <td><strong>₹{plan.price}</strong></td>
                        <td className="d-none d-lg-table-cell">
                          <small className="text-muted">{plan.description || 'Standard gym access'}</small>
                        </td>
                        <td>
                          {member?.planId?._id === plan._id ? (
                            <Button variant="success" size="sm" disabled>
                              ✓ Active Plan
                            </Button>
                          ) : (
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleOpenEnrollModal(plan)}
                              style={{ borderRadius: '6px' }}
                            >
                              📝 Enroll Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No plans available at the moment.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enrollment Modal */}
      <Modal show={showEnrollModal} onHide={handleCloseEnrollModal} centered backdrop="static">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">📝 Enroll in {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEnrollSubmit}>
          <Modal.Body>
            {enrollSuccess && <Alert variant="success">{enrollSuccess}</Alert>}
            {enrollError && <Alert variant="danger">{enrollError}</Alert>}

            <Alert variant="info" className="mb-3">
              <strong>Note:</strong> Fill in your details below. Your enrollment request will be sent to admin for approval. 
              Once approved, you'll become a gym member!
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Selected Plan</Form.Label>
              <Form.Control
                type="text"
                value={selectedPlan?.name || ''}
                disabled
              />
              <Form.Text className="text-muted">
                Price: ₹{selectedPlan?.price} | Duration: {selectedPlan?.duration}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={enrollData.phone}
                onChange={handleEnrollChange}
                required
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={enrollData.age}
                    onChange={handleEnrollChange}
                    required
                    min="1"
                    max="150"
                    placeholder="Age"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select 
                    name="gender" 
                    value={enrollData.gender} 
                    onChange={handleEnrollChange} 
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Join Date *</Form.Label>
              <Form.Control
                type="date"
                name="joinDate"
                value={enrollData.joinDate}
                onChange={handleEnrollChange}
                required
              />
            </Form.Group>

            <Alert variant="warning" className="mb-0">
              <strong>Important:</strong> After submitting, please wait for admin approval. 
              You'll receive access to all gym facilities once approved!
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseEnrollModal}
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
              📤 Submit Enrollment Request
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPlans;