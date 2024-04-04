import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setUserFullName }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
            const response = await axios.post('http://localhost:3001/login', formData);
            if (response.data.message === 'Login successful') {
                const { userFullName, userEmail } = response.data;
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userFullName', userFullName);
                sessionStorage.setItem('userEmail', userEmail); // Store user email in sessionStorage
                setUserFullName(userFullName);
                // Fetch user profile data based on user email after successful login
                const loggedInUserEmail = userEmail;
                const profileResponse = await axios.get(`http://localhost:3001/profile?userEmail=${loggedInUserEmail}`);
                // Handle profile data as needed
                console.log('User profile data:', profileResponse.data);
                navigate('/'); // Redirect to home page after successful login
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };
    
    return (
        <div className="container">
            <div className="login-container">
                <h2 className="mb-4">Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Email" required />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
