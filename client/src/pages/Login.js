import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState(''); // Default to an empty string
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for password mismatch during signup
    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    // Validate userType during login
    if (isLogin && !userType) {
      setMessage('Please select a user type (Student or Tutor)');
      return;
    }

    // Determine the API endpoint
    const url = isLogin
      ? '/api/login'
      : userType === 'student'
      ? '/api/register'
      : '/api/register-tutor';

    // Prepare the request payload
    const data = isLogin
      ? { email, password, userType } // Include userType for login requests
      : { fullName, email, password, userType };

    console.log('Submitting request to:', url);
    console.log('Request payload:', data);

    // Make the API request
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

          // Handle successful login
          if (isLogin && data.message === 'Login successful') {
            onLogin(data.name || ''); // Pass the user's name to the parent component
            navigate('/home');
          }

          // Handle successful signup
          if (!isLogin && (data.message === 'User signed up successfully' || data.message === 'Tutor signed up successfully')) {
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
          {!isLogin && (
            <>
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === 'student'}
                    onChange={() => setUserType('student')} // Ensure userType is updated correctly
                  />
                  Student
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="tutor"
                    checked={userType === 'tutor'}
                    onChange={() => setUserType('tutor')} // Ensure userType is updated correctly
                  />
                  Tutor
                </label>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {isLogin && (
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={() => setUserType('student')}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="tutor"
                  checked={userType === 'tutor'}
                  onChange={() => setUserType('tutor')}
                />
                Tutor
              </label>
            </div>
          )}
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