import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import api from '../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    planId: '',
    phone: '',
    age: 25,
    gender: 'Male',
    joinDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchPendingUsers();
    fetchPlans();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/pending');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
      setError('Failed to load pending users');
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

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setFormData({
      planId: '',
      phone: user.phone || '',
      age: 25,
      gender: 'Male',
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'Active'
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateExpiryDate = (planDuration) => {
    const joinDate = new Date(formData.joinDate);
    const expiry = new Date(joinDate);
    
    if (planDuration.includes('1 month')) {
      expiry.setMonth(expiry.getMonth() + 1);
    } else if (planDuration.includes('3 months')) {
      expiry.setMonth(expiry.getMonth() + 3);
    } else if (planDuration.includes('6 months')) {
      expiry.setMonth(expiry.getMonth() + 6);
    } else if (planDuration.includes('12 months')) {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }
    
    return expiry.toISOString().split('T')[0];
  };

  const handlePlanChange = (e) => {
    const selectedPlan = plans.find(p => p._id === e.target.value);
    const expiryDate = selectedPlan ? calculateExpiryDate(selectedPlan.duration) : '';
    
    setFormData({
      ...formData,
      planId: e.target.value,
      expiryDate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post(`/users/${selectedUser._id}/approve`, formData);
      setSuccess('User approved and added as member successfully!');
      setTimeout(() => {
        handleCloseModal();
        fetchPendingUsers();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const isMember = (user) => {
    return user.memberId !== null && user.memberId !== undefined;
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="mb-0">👥 User Management</h2>
        <p className="mb-0 mt-2">Manage registered users and approve memberships</p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 opacity-75">Total Registered Users</h6>
                  <h2 className="mb-0 fw-bold">{users.length}</h2>
                </div>
                <div style={{ fontSize: '3rem' }}>👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Card.Body className="text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 opacity-75">Pending Approvals</h6>
                  <h2 className="mb-0 fw-bold">{users.filter(u => !isMember(u)).length}</h2>
                </div>
                <div style={{ fontSize: '3rem' }}>⏳</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-4">Registered Users</h5>
          {users.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }}>📭</div>
              <p className="text-muted">No registered users found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Membership Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-semibold">{user.username}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {isMember(user) ? (
                        <Badge bg="success">✅ Member</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">⏳ Pending</Badge>
                      )}
                    </td>
                    <td>
                      {isMember(user) ? (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled
                        >
                          ✓ Already Member
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenModal(user)}
                        >
                          ✓ Approve & Add as Member
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Approval Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">
            👤 Approve User: {selectedUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser?.username || ''}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser?.email || ''}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="150"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Join Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Membership Plan *</Form.Label>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Auto-calculated based on plan duration
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
              ✓ Approve User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
