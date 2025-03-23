import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/tutors')
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

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