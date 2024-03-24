import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { useAuth } from './AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setAuthInfo } = useAuth();
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/login', credentials);
      setAuthInfo({ token: data.token, isAuthenticated: true, user: data.user }); // Update auth context
      navigate('/profile'); // Redirect to profile page using navigate
    } catch (error) {
      alert('Login failed: ', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
