import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const url = isLogin ? '/api/login' : '/api/register';
    const data = { email, password };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data); // Log the response data
        if (data.message) {
          setMessage(data.message);
          if (isLogin && data.message === 'Login successful') {
            onLogin();
            navigate('/home');
          } else if (!isLogin && data.message === 'User signed up successfully') {
            setMessage('Registration successful. Please sign in.');
            setIsLogin(true);
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage(error.message || 'An error occurred. Please try again.');
      });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Learning Bridge</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <div className="toggle-form">
          {isLogin ? (
            <p>
              New user? <a href="#signup" onClick={() => setIsLogin(false)}>Sign Up</a>
            </p>
          ) : (
            <p>
              Already have an account? <a href="#signin" onClick={() => setIsLogin(true)}>Sign In</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;