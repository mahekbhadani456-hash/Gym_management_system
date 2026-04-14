import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', { email: formData.email });
      const response = await api.post('/auth/login', formData);
      console.log('Login response:', response.data);
      
      setAuthToken(response.data.token);
      setUser(response.data);
      console.log('Navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '450px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        background: '#ffffff'
      }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
            <Card.Title className="mb-2" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2c3e50' }}>
              Gym Management System
            </Card.Title>
            <p className="text-muted mb-4">Admin Login Portal</p>
          </div>
          
          {error && (
            <Alert variant="danger" className="mb-3" style={{ borderRadius: '8px' }}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={{ borderRadius: '8px', padding: '0.75rem' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{ borderRadius: '8px', padding: '0.75rem' }}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 fw-semibold" 
              disabled={loading}
              style={{ 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '1rem',
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                '🔐 Login'
              )}
            </Button>
          </Form>
          
          <div className="text-center mt-4">
            <small className="text-muted">
               
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;

