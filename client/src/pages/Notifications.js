import React, { useEffect, useState } from 'react';
import './Notifications.css'; // Optional: Add styling for the notifications page

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
          console.log('Fetched notifications:', data); // Debugging log
          setNotifications(data);
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, []);

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
}

export default Notifications;
