import React, { useState } from 'react';
import './LoginForm.css'; // Ensure this file exists and has the necessary CSS
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    // TODO: Implement your login logic here, for example:
    // 1. Validate the username and password
    // 2. Send a request to the server
    // 3. Handle the response from the server

    // For now, let's assume the login is always successful and navigate to the homepage
    navigate('/'); // Redirect to the homepage
  };

  return (
    <div className='wrapper'>
        <form onSubmit={handleLogin}> {/* Update the form to call handleLogin */}
            <h1>Login</h1>
            <div className="input-box">
                <input 
                  type="text" 
                  placeholder='Username' 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FaUser className='icon' />
            </div>
            <div className="input-box">
                <input 
                  type="password" 
                  placeholder='Password' 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className='icon' />
            </div>
            <div className="remember-forgot">
                <label>
                  <input type="checkbox" />Remember me
                </label>
                <Link to="/forgot-password">Forgot Password</Link> {/* Keep using Link */}
            </div>
            <button type="submit">Login</button>
            
            <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>   
        </form>
    </div>
  );
};

export default LoginForm;
