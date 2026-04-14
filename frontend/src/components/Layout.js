import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    setShow(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/members', label: '👥 Members', icon: '👥' },
    { path: '/user-management', label: '👤 User Registrations', icon: '👤' },
    { path: '/trainers', label: '💪 Trainers', icon: '💪' },
    { path: '/plans', label: '📋 Plans', icon: '📋' },
    { path: '/payments', label: '💰 Payments', icon: '💰' },
  ];

  return (
    <>
      <Navbar 
        expand="lg" 
        className="custom-navbar"
        style={{ 
          background: '#ffffff',
          color: '#212529',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Container fluid className="navbar-container-wrapper">
          <div className="navbar-container">
            <Navbar.Brand 
              as={Link} 
              to="/dashboard" 
              className="fw-bold d-flex align-items-center brand-logo"
              style={{ 
                color: '#212529', 
                textDecoration: 'none',
                marginRight: '2rem',
                flexShrink: 0
              }}
            >
              <div className="logo-icon me-2">
                🏋️
              </div>
              <div className="brand-text">
                <div className="fw-bold brand-title">Gym Management</div>
                <div className="text-muted brand-subtitle">Fitness Management System</div>
              </div>
            </Navbar.Brand>
            
            {/* Desktop Navigation Menu */}
            <Navbar.Collapse id="navbar-nav" className="d-none d-lg-flex justify-content-center navbar-menu-wrapper">
              <Nav className="d-flex align-items-center nav-menu-desktop">
                {navItems.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`nav-link-custom ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.label.replace(/^[^\s]+\s/, '')}
                    {isActive(item.path) && (
                      <span className="nav-indicator"></span>
                    )}
                  </Nav.Link>
                ))}
              </Nav>
            </Navbar.Collapse>

            {/* User Info and Actions - Desktop */}
            {user && (
              <div className="d-none d-lg-flex align-items-center user-actions-desktop" style={{ flexShrink: 0 }}>
                <div className="d-flex align-items-center user-info-card">
                  <div className="user-avatar me-2">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="fw-semibold user-name">{user.username}</div>
                    <Badge bg="secondary" className="user-badge">{user.role}</Badge>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                >
                  Logout
                </button>
              </div>
            )}
            
            {/* Mobile/Tablet Hamburger Menu */}
            <Navbar.Toggle 
              aria-controls="offcanvasNavbar" 
              aria-label="Toggle navigation"
              onClick={() => setShow(true)}
              className="d-lg-none navbar-toggle-mobile"
              style={{
                border: '1px solid #dee2e6',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>
          </div>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            show={show}
            onHide={() => setShow(false)}
            style={{ width: '280px' }}
          >
            <Offcanvas.Header 
              closeButton 
              style={{ 
                background: '#ffffff', 
                color: '#212529',
                borderBottom: '1px solid #e9ecef',
                padding: '1.5rem'
              }}
            >
              <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold" style={{ color: '#212529', fontSize: '1.3rem' }}>
                🏋️ Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-3" style={{ background: '#ffffff' }}>
              {user && (
                <div className="mb-4 p-3 rounded user-info-card" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar me-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-bold fs-5" style={{ color: '#212529' }}>{user.username}</div>
                      <Badge bg="secondary" className="mt-1">{user.role}</Badge>
                    </div>
                  </div>
                </div>
              )}
              <Nav className="flex-column">
                {navItems.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                    style={{
                      color: isActive(item.path) ? '#212529' : '#6c757d',
                      textDecoration: 'none',
                      fontWeight: isActive(item.path) ? '600' : '500',
                    }}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.label.replace(/^[^\s]+\s/, '')}
                  </Nav.Link>
                ))}
                <hr className="my-3" />
                <Nav.Link
                  onClick={handleLogout}
                  className="sidebar-link text-danger"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="me-2">🚪</span>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Container className="main-content">
        {children}
      </Container>
    </>
  );
};

export default Layout;

