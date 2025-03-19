import React from 'react';
import './Header.css'; // Create a separate CSS file for header styles

function Header() {
  return (
    <header className="home-header">
      <div className="logo" onClick={() => window.location.href = '/home'}>Learning Bridge</div>
      <div className="search-bar">
        <input type="text" placeholder="Search tutors..." />
      </div>
      <div className="skills-dropdown">
        <select>
          <option value="">Select Skill</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="english">English</option>
        </select>
      </div>
      <div className="icons">
        <button className="filter-icon">Filter</button>
        <button className="notifications-icon">Notifications</button>
        <div className="profile-icon">
          <button>Profile</button>
          <div className="dropdown-content">
            <button onClick={() => window.location.href = '#'}>Profile Settings</button>
            <button onClick={() => window.location.href = '#'}>Account Details</button>
            <button onClick={() => window.location.href = '/'}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;