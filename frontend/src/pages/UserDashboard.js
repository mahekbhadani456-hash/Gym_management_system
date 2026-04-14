import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Table } from 'react-bootstrap';
import api from '../utils/api';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const daysUntilExpiry = member ? Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const totalDays = member ? Math.ceil((new Date(member.expiryDate) - new Date(member.joinDate)) / (1000 * 60 * 60 * 24)) : 1;
  const daysUsed = member ? Math.ceil((new Date() - new Date(member.joinDate)) / (1000 * 60 * 60 * 24)) : 0;
  const progressPercentage = member ? Math.min(100, Math.max(0, (daysUsed / totalDays) * 100)) : 0;

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
            <h2 className="mb-0">👋 Welcome back, {user?.name || 'Member'}!</h2>
            <p className="mb-0 mt-2">Your fitness journey dashboard</p>
          </div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {/* Membership Status Card */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <span className="me-2">💳</span> Membership Status
              </Card.Title>
              {member ? (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Membership:</span>
                      <Badge bg={member.status === 'Active' ? 'success' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Plan:</span>
                      <span className="fw-semibold">{member.planId?.name || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Expires:</span>
                      <span>{formatDate(member.expiryDate)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Membership Progress</small>
                      <small>{Math.round(progressPercentage)}%</small>
                    </div>
                    <ProgressBar 
                      now={progressPercentage} 
                      variant={progressPercentage > 75 ? 'success' : progressPercentage > 50 ? 'warning' : 'info'}
                    />
                    <div className="mt-2 text-center">
                      <small className="text-muted">
                        {daysUntilExpiry > 0 
                          ? `${daysUntilExpiry} days left` 
                          : daysUntilExpiry === 0 
                            ? 'Expires today' 
                            : `${Math.abs(daysUntilExpiry)} days overdue`}
                      </small>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted">No active membership found. Contact admin to enroll in a plan.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Personal Info Card */}
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <span className="me-2">👤</span> Personal Info
              </Card.Title>
              {user && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Name:</span>
                    <span className="fw-semibold">{user.name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Email:</span>
                    <span className="text-muted">{user.email}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Role:</span>
                    <Badge bg="secondary">{user.role}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Joined:</span>
                    <span>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                  </div>
                </div>
              )}
              {member && (
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Age:</span>
                    <span className="fw-semibold">{member.age}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Gender:</span>
                    <span className="fw-semibold">{member.gender}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Phone:</span>
                    <span className="text-muted">{member.phone}</span>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Stats Card */}
        <Col md={12} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <span className="me-2">📊</span> Quick Stats
              </Card.Title>
              <div className="text-center py-4">
                <div className="mb-3">
                  <h2>{member ? '✅' : '❌'}</h2>
                  <p className="mb-1">Membership</p>
                  <small className="text-muted">{member ? 'Active' : 'Inactive'}</small>
                </div>
                <div className="mb-3">
                  <h2>📅</h2>
                  <p className="mb-1">Next Session</p>
                  <small className="text-muted">Book with trainer</small>
                </div>
                <div>
                  <h2>🏆</h2>
                  <p className="mb-1">Achievements</p>
                  <small className="text-muted">Coming soon</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Plans Section */}
      <Row className="mb-4">
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
                      <th className="d-none d-lg-table-cell">Features</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id}>
                        <td className="fw-semibold">{plan.name}</td>
                        <td className="d-none d-md-table-cell">{plan.duration}</td>
                        <td>₹{plan.price}</td>
                        <td className="d-none d-lg-table-cell">
                          <small className="text-muted">{plan.description || 'Standard gym access'}</small>
                        </td>
                        <td>
                          {member?.planId?._id === plan._id ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="secondary">Available</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center mb-0">No plans available at the moment.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;