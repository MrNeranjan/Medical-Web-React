import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sign_Up.css';
import { API_URL } from '../../config';

const Sign_Up = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [showErr, setShowErr] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email.includes('@')) {
            return 'Please enter a valid email address.';
        }
        if (formData.password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!formData.name) {
            return 'Name is required.';
        }
        if (!formData.phone.match(/^\d{10}$/)) {
            return 'Phone number must be 10 digits.';
        }
        return '';
    };

    const register = async (e) => {
        e.preventDefault();
        
        const errorMessage = validateForm();
        if (errorMessage) {
            setShowErr(errorMessage);
            return;
        }

        // API Call
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        const json = await response.json();

        if (json.authtoken) {
            sessionStorage.setItem("auth-token", json.authtoken);
            sessionStorage.setItem("name", formData.name);
            sessionStorage.setItem("phone", formData.phone);
            sessionStorage.setItem("email", formData.email);
            navigate("/");
            window.location.reload();
        } else {
            setShowErr(json.errors ? json.errors.map(err => err.msg).join(', ') : json.error);
        }
    };

    return (
        <div className="container" style={{marginTop:'5%'}}>
            <div className="signup-grid">
                <div className="signup-text">
                    <h1>Sign Up</h1>
                </div>
                <div className="signup-text1" style={{ textAlign: "center" }}>
                    Already a member? <span><Link to="/Login" style={{ color: "#2190FF" }}>Login</Link></span>
                </div>
                <div className="signup-form">
                    <form onSubmit={register}>
                        {Object.entries(formData).map(([key, value]) => (
                            <div className="form-group" key={key}>
                                <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input
                                    value={value}
                                    onChange={handleChange}
                                    type={key === 'password' ? 'password' : 'text'}
                                    name={key}
                                    id={key}
                                    className="form-control"
                                    placeholder={`Enter your ${key}`}
                                    aria-describedby={`${key}Help`}
                                />
                            </div>
                        ))}
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary mb-2 mr-1 waves-effect waves-light">Submit</button>
                            <button type="reset" className="btn btn-danger mb-2 waves-effect waves-light">Reset</button>
                        </div>
                        {showErr && <div className="err" style={{ color: 'red' }}>{showErr}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sign_Up;
