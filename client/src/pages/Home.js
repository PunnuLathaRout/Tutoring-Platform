import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';
import './Login.js'; // Import the CSS file for styling

function Home() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [recommendedSlots, setRecommendedSlots] = useState([]); // State for recommended slots
  const [selectedTutor, setSelectedTutor] = useState(null); // State for selected tutor
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetch('/api/tutors') // Fetch all tutors initially
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tutors');
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching tutors:', error));
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail'); // Get the logged-in user's email

    if (userEmail) {
      fetch(`/api/notifications?email=${encodeURIComponent(userEmail)}`) // Fetch notifications for the user
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch notifications');
          return response.json();
        })
        .then(data => {
          console.log('Fetched notifications:', data); // Debugging log
          setNotifications(data);
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    fetch(`/api/tutors?search=${encodeURIComponent(query)}`) // Search API
      .then(response => {
        if (!response.ok) throw new Error('Failed to search tutors');
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => console.error('Error searching tutors:', error));
  };

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

  const handleNotificationClick = () => {
    navigate('/notifications'); // Navigate to the notifications page
  };

  const fetchRecommendedSlots = (studentEmail, tutorEmail) => {
    fetch(`/api/recommend-slots?studentEmail=${encodeURIComponent(studentEmail)}&tutorEmail=${encodeURIComponent(tutorEmail)}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch recommended slots');
        return response.json();
      })
      .then(data => {
        console.log('Recommended slots:', data.recommendedSlots); // Debugging log
        setRecommendedSlots(data.recommendedSlots);
      })
      .catch(error => console.error('Error fetching recommended slots:', error));
  };

  const handleTutorClick = (tutor) => {
    const studentEmail = localStorage.getItem('userEmail'); // Get the logged-in user's email
    if (!studentEmail) {
      console.error('User email not found in localStorage');
      return;
    }

    setSelectedTutor(tutor); // Set the selected tutor
    fetchRecommendedSlots(studentEmail, tutor.email); // Fetch recommended slots for the selected tutor
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tutors..."
            value={searchQuery}
            onChange={handleSearch} // Trigger search on input change
          />
        </div>
        <div className="notification-icon" onClick={handleNotificationClick}>
          🔔
          {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
        </div>
      </header>
      <div className="main-content">
        <nav className="sidebar">
          <h1>Learning Bridge</h1>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-classes">My Classes</a>
          <a href="/teachers">Teachers</a>
          <a href="/bookteacher">Book A Teacher</a>
          <a href="/profile">Profile</a>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <div className="content">
          <div className="grid-container">
            {items.map((item, index) => (
              <div className="grid-item" key={index}>
                <h2 
                  className="clickable-name" 
                  onClick={() => handleTutorClick(item)} // Fetch recommendations on tutor click
                >
                  {item.name}
                </h2>
                <p>Qualifications: {item.qualifications}</p>
                <p>Hourly Rate: {item.hourlyRate}</p>
                <p>Email: {item.email}</p>
                <p>availability : {item.availability }</p>
                <p>Subject: {item.subject}</p>
                <button 
                  className="button" 
                  onClick={() => navigate(`/bookteacher?teacherName=${encodeURIComponent(item.name)}`)} // Pass teacher name as query param
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
          {selectedTutor && recommendedSlots.length > 0 && (
            <div className="recommendation-section">
              <h3>Recommended Time Slots for {selectedTutor.name}:</h3>
              <ul>
                {recommendedSlots.map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2025 Learning Bridge. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;