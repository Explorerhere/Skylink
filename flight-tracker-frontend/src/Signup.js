// src/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', userData);
            alert(response.data.message); // Or handle success in another way
        } catch (error) {
            console.error('Signup error:', error.response.data);
            alert(error.response.data.error); // Or handle error in another way
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" required onChange={handleChange} /><br />
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} /><br />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} /><br />
                <input type="text" name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} /><br />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;
