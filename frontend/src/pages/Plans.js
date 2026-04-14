import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
} from 'react-bootstrap';
import api from '../utils/api';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    duration: '1 month',
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      setError('Failed to fetch plans');
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan._id);
      setFormData({
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        description: plan.description || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        duration: '1 month',
        price: '',
        description: '',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
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
      if (editingPlan) {
        await api.put(`/plans/${editingPlan}`, formData);
      } else {
        await api.post('/plans', formData);
      }
      fetchPlans();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (error) {
        setError('Failed to delete plan');
      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.duration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h2 className="mb-0">📋 Membership Plans</h2>
            <p className="mb-0 mt-2">Create and manage membership plans</p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              className="btn-add-new"
            >
              <span className="me-2">➕</span>
              Create New Plan
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
            placeholder="Search by name or duration..."
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
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Price (₹)</th>
                <th className="d-none d-lg-table-cell">Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No plans found</td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan._id}>
                    <td className="fw-semibold">{plan.name}</td>
                    <td>{plan.duration}</td>
                    <td className="fw-bold">₹{plan.price.toLocaleString()}</td>
                    <td className="d-none d-lg-table-cell">{plan.description || 'N/A'}</td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row gap-1">
                        <Button
                          variant="warning"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleOpenModal(plan)}
                          style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleDelete(plan._id)}
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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">
            {editingPlan ? '✏️ Edit Plan' : '➕ Create New Plan'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Plan Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Basic Plan, Premium Plan"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration *</Form.Label>
              <Form.Select name="duration" value={formData.duration} onChange={handleChange} required>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹) *</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Plan features and benefits..."
              />
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
              {editingPlan ? '💾 Update Plan' : '➕ Create Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Plans;

