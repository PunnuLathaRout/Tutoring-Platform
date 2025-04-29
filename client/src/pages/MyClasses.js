import React, { useEffect, useState } from 'react';
import './MyClasses.css';

function MyClasses() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentEmail = localStorage.getItem('userEmail'); // Get the logged-in student's email

    if (!studentEmail) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    fetch(`/api/bookings/student/${studentEmail}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return response.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setError('Error fetching bookings');
        setLoading(false);
      });
  }, []);

  const handleCancel = (bookingId, tutorEmail) => {
    const studentEmail = localStorage.getItem('userEmail'); // Get the logged-in student's email

    fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId, studentEmail, tutorEmail }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to cancel booking');
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Debugging log
        setBookings(bookings.filter((booking) => booking.id !== bookingId)); // Remove canceled booking from the list
      })
      .catch((error) => console.error('Error canceling booking:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-classes-container">
      <h1>My Classes</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-item" key={booking.id}>
              <h2>{booking.tutorName}</h2>
              <p>Qualifications: {booking.qualifications}</p>
              <p>Hourly Rate: {booking.hourlyRate}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Email: {booking.tutorEmail}</p>
              <button onClick={() => handleCancel(booking.id, booking.tutorEmail)}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClasses;