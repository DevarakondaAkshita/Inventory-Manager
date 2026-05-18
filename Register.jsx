import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connects directly to your backend registration endpoint
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage(res.data.message || 'Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input type="text" name="name" value={name} onChange={onChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: 'blue', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default Register;