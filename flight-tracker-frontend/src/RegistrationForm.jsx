import React from 'react';
import './RegistrationForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    

    // Example:
    // if (registrationSuccess) {
      navigate('/login'); // This will navigate to the login page after successful registration.
    // }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}> {/* You need to call the handleSubmit function here */}
        <h1>Register</h1>
        <div className="input-box">
          <input type="email" placeholder='Email' required/>
          <FaEnvelope className='icon' />
        </div>
        <div className="input-box">
          <input type="text" placeholder='Username' required/>
          <FaUser className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder='Password' required/>
          <FaLock className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder='Confirm Password' required/>
          <FaLock className='icon' />
        </div>
        <button type="submit">Register</button>
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
