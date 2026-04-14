import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import api from '../utils/api';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userResponse = await api.get('/users/profile');
        const userData = userResponse.data;
        
        setUser({
          name: userData.name || userData.username,
          email: userData.email,
          password: ''
        });

        // Get user member details
        try {
          const memberResponse = await api.get('/users/member');
          setMember(memberResponse.data);
        } catch (error) {
          console.log('User does not have member details yet');
        }
      } catch (error) {
        setError('Failed to load profile data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: user.name,
        email: user.email
      };

      if (user.password) {
        payload.password = user.password;
      }

      const response = await api.put('/users/profile', payload);
      setUser({
        name: response.data.name || response.data.username,
        email: response.data.email,
        password: ''
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
            <h2 className="mb-0">👤 My Profile</h2>
            <p className="mb-0 mt-2">Manage your account settings</p>
          </div>
        </div>
      </div>

      <Row className="g-4">
        {/* Personal Information Card */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">👤</span> Personal Information
              </h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>New Password (optional)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                  <Form.Text className="text-muted">
                    Enter a new password only if you want to change it
                  </Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    padding: '8px 16px',
                    fontWeight: '600'
                  }}
                >
                  {saving ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Account Details Card */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">🔒</span> Account Details
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Role:</span>
                  <Badge bg="secondary">{user.role}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Member Since:</span>
                  <span>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Last Updated:</span>
                  <span>{user.updatedAt ? formatDate(user.updatedAt) : 'N/A'}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Membership Details Card */}
          {member && (
            <Card className="shadow-sm mt-4">
              <Card.Header>
                <h5 className="mb-0 d-flex align-items-center">
                  <span className="me-2">💳</span> Membership Details
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Plan:</span>
                    <span className="fw-semibold">{member.planId?.name || 'N/A'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Status:</span>
                    <Badge bg={member.status === 'Active' ? 'success' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Join Date:</span>
                    <span>{member.joinDate ? formatDate(member.joinDate) : 'N/A'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Expiry Date:</span>
                    <span>{member.expiryDate ? formatDate(member.expiryDate) : 'N/A'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Age:</span>
                    <span>{member.age}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Gender:</span>
                    <span>{member.gender}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;