import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalTrainers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: '👥',
      color: 'dark',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: '✅',
      color: 'success',
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Trainers',
      value: stats.totalTrainers,
      icon: '💪',
      color: 'secondary',
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'dark',
      bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="mb-0">Dashboard Overview</h2>
        <p className="mb-0 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading statistics...</p>
        </div>
      ) : (
        <Row className="g-4">
          {statCards.map((stat, index) => (
            <Col key={index} md={6} lg={3}>
              <Card className="stat-card h-100 border-0">
                <Card.Body className="text-center" style={{ background: stat.bgColor, color: 'white', borderRadius: '10px', padding: '2rem' }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <Card.Title className="mb-2" style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.95 }}>
                    {stat.title}
                  </Card.Title>
                  <h2 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                    {stat.value}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;

