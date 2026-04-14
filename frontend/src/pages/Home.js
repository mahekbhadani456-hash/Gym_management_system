import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const Home = () => {
  // If already authenticated, redirect to appropriate dashboard
  try {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        if (user.role === 'admin') {
          return <Navigate to="/dashboard" />;
        } else if (user.role === 'user') {
          return <Navigate to="/user-dashboard" />;
        }
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
    // Continue to show login page even if there's an error
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Container>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            🏋️ Gym Management System
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)' }}>
            Your Complete Fitness Management Solution
          </p>
        </div>

        {/* Login Options Cards */}
        <Row className="g-4 justify-content-center">
          {/* Admin Login Card */}
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 h-100" style={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Header style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>👨‍💼</div>
                <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>Admin Portal</h2>
              </Card.Header>
              <Card.Body className="p-4" style={{ background: '#ffffff' }}>
                <p className="text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  Manage your gym with complete control over members, trainers, plans, and payments.
                </p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Dashboard Statistics</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Member Management</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Trainer Management</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Payment Tracking</span>
                  </li>
                </ul>
                <Button 
                  as={Link}
                  to="/login"
                  variant="primary"
                  className="w-100 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem'
                  }}
                >
                  🔐 Admin Login
                </Button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Default: admin@gym.com / admin123
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* User Login Card */}
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 h-100" style={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Header style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>💪</div>
                <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>Member Portal</h2>
              </Card.Header>
              <Card.Body className="p-4" style={{ background: '#ffffff' }}>
                <p className="text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  Access your membership details, view plans, and track your fitness journey.
                </p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>View Membership Status</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Check Plan Details</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Manage Profile</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <span className="me-2 text-success">✓</span>
                    <span>Track Expiry Date</span>
                  </li>
                </ul>
                <Button 
                  as={Link}
                  to="/user-login"
                  variant="primary"
                  className="w-100 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem'
                  }}
                >
                  🚀 Member Login
                </Button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/user-register" className="text-decoration-none fw-semibold">
                      Register here
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer Info */}
        <div className="text-center mt-5">
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            Welcome to our state-of-the-art gym management system
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            © 2024 Gym Management System. All rights reserved.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Home;
