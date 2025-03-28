import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';
import './Login.js'; // Import the CSS file for styling

function Home() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetch('/api/tutors')
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('authToken'); // Remove auth token
    localStorage.removeItem('userType'); // Remove user type
    localStorage.removeItem('userName'); // Remove user name if stored
  
    // Optionally, clear other session-related data if needed
    console.log('User logged out successfully.');
  
    // Redirect to the login page (handled by Login.js)
    navigate('/'); // Use navigate to redirect to the login page
  };



  return (
    <div className="app-container">
      <header className="header">
        <div className="search-bar">
          <input type="text" placeholder="Search tutors..." />
        </div>
        <div className="notification-icon">🔔</div>
      </header>
      <div className="main-content">
        <nav className="sidebar">
          <h1>Learning Bridge</h1>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-classes">My Classes</a>
          <a href="/teachers">Teachers</a>
          <a href="/book-a-teacher">Book A Teacher</a>
          <a href="/profile">Profile</a>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <div className="content">
          <div className="grid-container">
            {items.map((item, index) => (
              <div className="grid-item" key={index}>
                <h2>{item.name}</h2>
                <p>Qualifications: {item.qualifications}</p>
                <p>Hourly Rate: {item.hourlyRate}</p>
                <p>Email: {item.email}</p>
                <button className="button">Book Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2025 Learning Bridge. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;