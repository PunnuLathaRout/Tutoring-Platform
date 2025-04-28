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
          // if (isLogin && data.message === 'Login successful') {
          //   onLogin(data.name || ''); // Pass the user's name to the parent component
          //   navigate('/home');
          // }

          // if (isLogin && data.message === 'Login successful') {
          //   console.log('Auth token:', data.token); // Log the token
          //   if (data.token) {
          //     localStorage.setItem('authToken', data.token); // Save auth token
          //   } else {
          //     console.error('No authToken received from the server');
          //   }
          //   navigate('/home');
          // }

          if (isLogin && data.message === 'Login successful') {
            console.log('Login successful:', data);
            localStorage.setItem('userEmail', data.email); // Store the email in localStorage
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
                <label>User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select User Type
                  </option>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>
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
              <label>User Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
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