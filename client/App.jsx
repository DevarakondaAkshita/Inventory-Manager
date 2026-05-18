import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // 1. Import Dashboard

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <nav style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Sign In</a>
          <a href="/register" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Create Account</a>
          <a href="/dashboard" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Dashboard</a>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* 2. Add Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;