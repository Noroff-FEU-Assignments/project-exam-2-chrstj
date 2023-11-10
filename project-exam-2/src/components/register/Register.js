import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check each field is not empty
    if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
      setError('All fields are required');
      return;
    }

    // Check if email is a "stud.noroff.no" email
    if (!/^[\w-.]+@stud\.noroff\.no$/i.test(formData.email)) {
      setError('Invalid email. Only "stud.noroff.no" emails are accepted.');
      return;
    }

    // Check if name is at least 3 characters
    if (formData.name.length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }

    // Check if password is at least 5 characters
    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    try {
      const response = await fetch('https://nf-api.onrender.com/api/v1/social/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();

        const accessToken = data.accessToken;
        const name = data.name;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('name', name);
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      setError('Error during registration: ' + error);
    }
  };


  return (
  <div className="container-sm text-center">
<div className="register-page">
<h1>Register</h1>
<input className="register-input"
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleInputChange} required
/>
</div>
<div>
<input className="register-input"
  type="password"
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleInputChange} required
/>
</div>
<div>
<input className="register-input"
  type="text"
  name="name" 
  placeholder="Name"
  value={formData.name}
  onChange={handleInputChange} 
/>
</div>
<button className="btn btn-primary" onClick={handleFormSubmit}>Register</button>
{error && <div className="error-message">{error}</div>}


<p>Already have a user?</p>
      <Link to="/login">
        <button className="btn btn-secondary">Log In</button>
      </Link>
</div>
  );
};

export default Register;


