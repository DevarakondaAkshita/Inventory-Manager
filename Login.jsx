import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send authentication request to your Express server
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // 2. Save the custom JWT token securely inside the user's browser context
      localStorage.setItem('token', res.data.user.token);
      
      setMessage(`Welcome back, ${res.data.user.name}! Redirecting to dashboard...`);
      
      // 3. Smoothly push the user onto the Dashboard screen after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      // Handles missing accounts or incorrect password mismatches dynamically
      setMessage(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Sign In</h2>
      
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address:</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Login
        </button>
      </form>
      
      {message && (
        <p style={{ 
          marginTop: '15px', 
          padding: '10px', 
          borderRadius: '4px', 
          textAlign: 'center',
          backgroundColor: message.includes('Welcome') ? '#e2f0d9' : '#fce4d6',
          color: message.includes('Welcome') ? 'green' : 'red', 
          fontWeight: 'bold' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;