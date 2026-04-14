import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import api from '../utils/api';

const UserTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [userTrainer, setUserTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get all trainers
      const trainersResponse = await api.get('/trainers');
      setTrainers(trainersResponse.data);

      // Get user profile to check assigned trainer
      const userProfile = await api.get('/users/profile');
      if (userProfile.data.trainer) {
        setUserTrainer(userProfile.data.trainer);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    
    // If trainer already assigned, show confirmation
    if (userTrainer && userTrainer._id !== trainer._id) {
      setShowConfirmModal(true);
    } else if (!userTrainer) {
      // No trainer assigned yet, assign directly
      assignTrainer(trainer._id);
    } else {
      // Same trainer selected
      setSuccessMessage('This trainer is already assigned to you!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleConfirmChange = () => {
    setShowConfirmModal(false);
    assignTrainer(selectedTrainer._id);
  };

  const assignTrainer = async (trainerId) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await api.post('/users/select-trainer', { trainerId });
      
      setSuccessMessage('Trainer selected successfully!');
      
      // Refresh data
      setTimeout(() => {
        fetchData();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to select trainer');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getSpecializationBadge = (specialization) => {
    const colors = {
      'Weight Loss': 'success',
      'Muscle Gain': 'primary',
      'Yoga': 'warning',
      'Cardio': 'danger',
      'Strength Training': 'info',
      'CrossFit': 'dark'
    };
    return colors[specialization] || 'secondary';
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
            <h2 className="mb-0">🏋️ Available Trainers</h2>
            <p className="mb-0 mt-2">Choose a personal trainer for your fitness journey</p>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          ✅ {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="danger" className="mb-4">
          ⚠️ {errorMessage}
        </Alert>
      )}

      {/* Current Trainer Card */}
      {userTrainer && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-primary">
              <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                <h5 className="mb-0">
                  <span className="me-2">⭐</span> Your Current Trainer
                </h5>
                <Badge bg="light" text="primary">Assigned</Badge>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <div className="d-flex align-items-start">
                      <div 
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '70px', 
                          height: '70px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontSize: '2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {userTrainer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{userTrainer.name}</h4>
                        <Badge bg={getSpecializationBadge(userTrainer.specialization)} className="mb-2">
                          {userTrainer.specialization}
                        </Badge>
                        <div className="text-muted">
                          <div className="mb-1">📞 {userTrainer.phone}</div>
                          <div>💼 {userTrainer.experience} years experience</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-end">
                    <div className="text-end">
                      <div className="text-muted mb-1">Monthly Fee</div>
                      <h3 className="text-primary mb-0">₹{userTrainer.fees?.toLocaleString('en-IN') || 0}</h3>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* All Trainers Grid */}
      <Row className="g-4">
        {trainers.filter(t => t.status === 'Active').map((trainer) => {
          const isAssigned = userTrainer && userTrainer._id === trainer._id;
          
          return (
            <Col md={6} lg={4} key={trainer._id}>
              <Card 
                className={`h-100 shadow-sm ${isAssigned ? 'border-primary border-2' : ''}`}
                style={{ transition: 'all 0.3s' }}
              >
                <Card.Body>
                  <div className="text-center mb-3">
                    <div 
                      className="d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: isAssigned 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {trainer.name?.charAt(0).toUpperCase()}
                    </div>
                    <Card.Title className="mb-1">{trainer.name}</Card.Title>
                    <Badge bg={getSpecializationBadge(trainer.specialization)} className="mb-2">
                      {trainer.specialization}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Experience:</span>
                      <strong>{trainer.experience} years</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Phone:</span>
                      <strong>{trainer.phone}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Monthly Fee:</span>
                      <strong className="text-primary">₹{trainer.fees?.toLocaleString('en-IN') || 0}</strong>
                    </div>
                  </div>

                  <Button
                    variant={isAssigned ? 'success' : 'primary'}
                    className="w-100"
                    onClick={() => handleSelectTrainer(trainer)}
                    disabled={isAssigned}
                    style={{
                      background: isAssigned ? '#28a745' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    {isAssigned ? '✓ Assigned' : '🎯 Select Trainer'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {trainers.filter(t => t.status === 'Active').length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }} className="mb-3">🏋️</div>
          <h4 className="text-muted">No Trainers Available</h4>
          <p className="text-muted">Please contact admin to add trainers.</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="fw-bold">⚠️ Confirm Trainer Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userTrainer && (
            <Alert variant="warning" className="mb-3">
              <strong>Current Trainer:</strong> {userTrainer.name} ({userTrainer.specialization})
            </Alert>
          )}
          
          {selectedTrainer && (
            <Alert variant="info" className="mb-3">
              <strong>New Trainer:</strong> {selectedTrainer.name} ({selectedTrainer.specialization})
            </Alert>
          )}

          <p className="mb-0">
            Are you sure you want to change your trainer? This action will update your assigned trainer immediately.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmModal(false)}
            style={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmChange}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            ✓ Confirm Change
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTrainers;
