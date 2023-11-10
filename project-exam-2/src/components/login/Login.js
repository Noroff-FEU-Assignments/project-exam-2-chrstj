import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    fetch('https://nf-api.onrender.com/api/v1/social/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Login failed');
    })
    .then(data => {
      const accessToken = data.accessToken;
      const name = data.name;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('name', name);
      onLogin(name, accessToken);
      setError(null);
    })
    .catch(error => {
      setError('Invalid credentials');
    });
  };

  return (
    <div className="container-sm text-center">
      <div className="login-page">
        <h1>Welcome to Socialize</h1>
        <h2>Login</h2>
        <input className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <input className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>Login</button>

        <p>Don't have a user?</p>
        <Link to="/register">
          <button className="btn btn-secondary">Register Here</button>
        </Link>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
