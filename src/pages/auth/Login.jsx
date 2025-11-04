import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, we'll just redirect to dashboard
    // In Phase 2, we'll add real authentication
    console.log('Logging in:', { username, password });
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎓 Career Guide</h1>
          <p>Welcome back! Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? 
            <span className="link" onClick={() => navigate('/register')}>
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;