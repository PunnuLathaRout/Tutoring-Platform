import React, { useEffect, useState } from 'react';
import './Notifications.css'; // Import the CSS file for styling

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail'); // Get the logged-in user's email

    if (userEmail) {
      fetch(`/api/notifications?email=${encodeURIComponent(userEmail)}`) // Fetch notifications for the user
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch notifications');
          return response.json();
        })
        .then(data => {
          setNotifications(data); // Update state with fetched notifications
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>
      {notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((notification, index) => (
            <li key={index} className="notification-item">
              <span className="notification-message">{notification.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-notifications">No notifications available.</p>
      )}
    </div>
  );
}

export default Notifications;
