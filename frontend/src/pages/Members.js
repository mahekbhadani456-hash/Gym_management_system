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
} from 'react-bootstrap';
import api from '../utils/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    planId: '',
    joinDate: '',
    expiryDate: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      setError('Failed to fetch members');
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

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member._id);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        age: member.age,
        gender: member.gender,
        planId: member.planId._id || member.planId,
        joinDate: member.joinDate.split('T')[0],
        expiryDate: member.expiryDate.split('T')[0],
        status: member.status,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        planId: '',
        joinDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        status: 'Active',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingMember) {
        await api.put(`/members/${editingMember}`, formData);
      } else {
        await api.post('/members', formData);
      }
      fetchMembers();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        fetchMembers();
      } catch (error) {
        setError('Failed to delete member');
      }
    }
  };

  const handleTogglePaymentStatus = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
      await api.put(`/members/${memberId}/payment-status`, {
        paymentStatus: newStatus
      });
      fetchMembers();
    } catch (error) {
      setError('Failed to update payment status');
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h2 className="mb-0">👥 Members Management</h2>
            <p className="mb-0 mt-2">Manage all gym members and their memberships</p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              className="btn-add-new"
            >
              <span className="me-2">➕</span>
              Add New Member
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3" style={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      <div className="search-box">
        <InputGroup>
          <InputGroup.Text style={{ background: '#f8f9fa', borderRight: 'none' }}>
            🔍
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by name, email, or phone..."
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="d-none d-md-table-cell">Age</th>
                <th className="d-none d-lg-table-cell">Gender</th>
                <th>Plan</th>
                <th className="d-none d-md-table-cell">Join Date</th>
                <th className="d-none d-lg-table-cell">Expiry Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">No members found</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id}>
                    <td className="fw-semibold">{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td className="d-none d-md-table-cell">{member.age}</td>
                    <td className="d-none d-lg-table-cell">{member.gender}</td>
                    <td>
                      <span className="badge bg-info text-dark">{member.planId?.name || 'N/A'}</span>
                    </td>
                    <td className="d-none d-md-table-cell">{new Date(member.joinDate).toLocaleDateString()}</td>
                    <td className="d-none d-lg-table-cell">{new Date(member.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={member.status === 'Active' ? 'success' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant={member.paymentStatus === 'Paid' ? 'success' : 'warning'}
                        size="sm"
                        onClick={() => handleTogglePaymentStatus(member._id, member.paymentStatus)}
                        style={{ borderRadius: '6px', fontSize: '0.85rem', minWidth: '80px' }}
                      >
                        {member.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Pending'}
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row gap-1">
                        <Button
                          variant="warning"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleOpenModal(member)}
                          style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleDelete(member._id)}
                          style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
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
          <Modal.Title className="fw-bold">
            {editingMember ? '✏️ Edit Member' : '➕ Add New Member'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Membership Plan *</Form.Label>
                  <Form.Select name="planId" value={formData.planId} onChange={handleChange} required>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
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
              {editingMember ? '💾 Update Member' : '➕ Add Member'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Members;

