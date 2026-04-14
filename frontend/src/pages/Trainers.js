import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  Badge,
} from 'react-bootstrap';
import api from '../utils/api';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    experience: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/trainers');
      setTrainers(response.data);
    } catch (error) {
      setError('Failed to fetch trainers');
    }
  };

  const handleOpenModal = (trainer = null) => {
    if (trainer) {
      setEditingTrainer(trainer._id);
      setFormData({
        name: trainer.name,
        specialization: trainer.specialization,
        phone: trainer.phone,
        experience: trainer.experience,
        status: trainer.status,
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        name: '',
        specialization: '',
        phone: '',
        experience: '',
        status: 'Active',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
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
      if (editingTrainer) {
        await api.put(`/trainers/${editingTrainer}`, formData);
      } else {
        await api.post('/trainers', formData);
      }
      fetchTrainers();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save trainer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await api.delete(`/trainers/${id}`);
        fetchTrainers();
      } catch (error) {
        setError('Failed to delete trainer');
      }
    }
  };

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="page-header">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h2 className="mb-0">💪 Trainers Management</h2>
            <p className="mb-0 mt-2">Manage gym trainers and their specializations</p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              className="btn-add-new"
            >
              <span className="me-2">➕</span>
              Add New Trainer
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
            placeholder="Search by name, specialization, or phone..."
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
                <th>Specialization</th>
                <th>Phone</th>
                <th className="d-none d-md-table-cell">Experience (Years)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No trainers found</td>
                </tr>
              ) : (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer._id}>
                    <td className="fw-semibold">{trainer.name}</td>
                    <td>{trainer.specialization}</td>
                    <td>{trainer.phone}</td>
                    <td className="d-none d-md-table-cell">{trainer.experience}</td>
                    <td>
                      <Badge bg={trainer.status === 'Active' ? 'success' : 'secondary'}>
                        {trainer.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-sm-row gap-1">
                        <Button
                          variant="warning"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleOpenModal(trainer)}
                          style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleDelete(trainer._id)}
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
            {editingTrainer ? '✏️ Edit Trainer' : '➕ Add New Trainer'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Group className="mb-3">
              <Form.Label>Specialization *</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="e.g., Weight Training, Yoga, Cardio"
              />
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Label>Experience (Years) *</Form.Label>
              <Form.Control
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
              />
            </Form.Group>
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
              {editingTrainer ? '💾 Update Trainer' : '➕ Add Trainer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Trainers;

