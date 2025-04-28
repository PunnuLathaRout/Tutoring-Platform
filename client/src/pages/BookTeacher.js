import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './BookTeacher.css';

function BookTeacher() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teacherName = queryParams.get('teacherName'); // Extract teacher name

  useEffect(() => {
    // Fetch the list of tutors
    fetch('/api/tutors')
      .then((response) => response.json())
      .then((data) => {
        setTutors(data);
        if (teacherName) {
          const selectedTutor = data.find((tutor) => tutor.name === teacherName);
          if (selectedTutor) {
            setSelectedTutor(selectedTutor.email); // Pre-select the tutor
          }
        }
      })
      .catch((error) => console.error('Error fetching tutors:', error));
  }, []);

  const handleBooking = () => {
    if (!selectedTutor || !date || !time) {
      setMessage('Please fill in all fields');
      return;
    }

    const studentEmail = localStorage.getItem('userEmail'); // Get the logged-in student's email

    fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentEmail,
        tutorEmail: selectedTutor,
        date,
        time,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create booking');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setSelectedTutor('');
        setDate('');
        setTime('');
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        setMessage('Error creating booking');
      });
  };

  return (
    <div className="book-teacher-container">
      <h1>Book a Teacher</h1>
      {message && <p className="message">{message}</p>}
      <div className="form-group">
        <select
          id="tutor"
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
        >
          <option value="">-- Select a Tutor --</option>
          {tutors.map((tutor) => (
            <option key={tutor.email} value={tutor.email}>
              {tutor.name} - {tutor.qualifications}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Select Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
}

export default BookTeacher;