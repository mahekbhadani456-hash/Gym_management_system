import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UserLayout from './components/UserLayout';
import PrivateRoute from './components/PrivateRoute';
import UserPrivateRoute from './components/UserPrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import UserRegistration from './pages/UserRegistration';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import UserPlans from './pages/UserPlans';
import UserProfile from './pages/UserProfile';
import Members from './pages/Members';
import Trainers from './pages/Trainers';
import Plans from './pages/Plans';
import Payments from './pages/Payments';
import UserManagement from './pages/UserManagement';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Admin Panel Routes */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute>
              <Layout>
                <Members />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trainers"
          element={
            <PrivateRoute>
              <Layout>
                <Trainers />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <Layout>
                <Plans />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute>
              <Layout>
                <Payments />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <PrivateRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        
        {/* User Panel Routes */}
        <Route
          path="/user-login"
          element={isAuthenticated() ? <Navigate to="/user-dashboard" /> : <UserLogin />}
        />
        <Route
          path="/user-register"
          element={isAuthenticated() ? <Navigate to="/user-dashboard" /> : <UserRegistration />}
        />
        <Route
          path="/user-dashboard"
          element={
            <UserPrivateRoute>
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            </UserPrivateRoute>
          }
        />
        <Route
          path="/user-plans"
          element={
            <UserPrivateRoute>
              <UserLayout>
                <UserPlans />
              </UserLayout>
            </UserPrivateRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <UserPrivateRoute>
              <UserLayout>
                <UserProfile />
              </UserLayout>
            </UserPrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

