import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './BookTeacher.css';

function BookTeacher() {
  const [tutors, setTutors] = useState([]);
  const [suggestedTutors, setSuggestedTutors] = useState([]); // State for suggested tutors
  const [selectedTutor, setSelectedTutor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [recommendedSlots, setRecommendedSlots] = useState([]); // State for recommended slots

  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location]);
  const teacherName = useMemo(() => queryParams.get('teacherName'), [queryParams]); // Memoize teacherName
  const randomTutorsFromHome = useMemo(() => queryParams.get('randomTutors'), [queryParams]); // Get random tutors from query

  useEffect(() => {
    if (randomTutorsFromHome) {
      // Parse random tutors passed from the home page
      setSuggestedTutors(JSON.parse(randomTutorsFromHome));
    } else {
      // Fetch the list of tutors
      fetch('/api/tutors')
        .then((response) => response.json())
        .then((data) => {
          setTutors(data);
          console.log('Fetched tutors:', data); // Debugging log
          if (teacherName) {
            const selectedTutor = data.find((tutor) => tutor.name === teacherName);
            if (selectedTutor) {
              setSelectedTutor(selectedTutor.email); // Pre-select the tutor
              fetchRecommendedSlots(selectedTutor.email); // Fetch recommendations for pre-selected tutor
            }
          } else {
            // Fetch 3 random tutors for suggestions
            fetch('/api/random-tutors')
              .then((response) => response.json())
              .then((randomTutors) => {
                console.log('Fetched random tutors:', randomTutors); // Debugging log
                setSuggestedTutors(randomTutors);
              })
              .catch((error) => console.error('Error fetching random tutors:', error));
          }
        })
        .catch((error) => console.error('Error fetching tutors:', error));
    }
  }, [teacherName, randomTutorsFromHome]); // Include teacherName and randomTutorsFromHome in the dependency array

  const fetchRecommendedSlots = (tutorEmail) => {
    const studentEmail = localStorage.getItem('userEmail'); // Get the logged-in student's email
    if (!studentEmail) {
      console.error('User email not found in localStorage'); // Debugging log
      return;
    }

    console.log('Fetching recommended slots for:', studentEmail, tutorEmail); // Debugging log

    fetch(`/api/recommend-slots?studentEmail=${encodeURIComponent(studentEmail)}&tutorEmail=${encodeURIComponent(tutorEmail)}`)
      .then((response) => {
        console.log('Response status:', response.status); // Debugging log
        if (!response.ok) throw new Error('Failed to fetch recommended slots');
        return response.json();
      })
      .then((data) => {
        console.log('Recommended slots:', data.recommendedSlots); // Debugging log
        setRecommendedSlots(data.recommendedSlots);
      })
      .catch((error) => console.error('Error fetching recommended slots:', error));
  };

  const handleTutorChange = (e) => {
    const tutorEmail = e.target.value;
    setSelectedTutor(tutorEmail);
    if (tutorEmail) {
      fetchRecommendedSlots(tutorEmail); // Fetch recommendations when a tutor is selected
    } else {
      setRecommendedSlots([]); // Clear recommendations if no tutor is selected
    }
  };

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
        setRecommendedSlots([]); // Clear recommendations after booking
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
      {suggestedTutors.length > 0 && (
        <div className="suggested-tutors">
          <h3>Suggested Teachers</h3>
          <ul>
            {suggestedTutors.map((tutor) => (
              <li key={tutor.email}>
                {tutor.name} - {tutor.qualifications}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="form-group">
        <select
          id="tutor"
          value={selectedTutor}
          onChange={handleTutorChange} // Fetch recommendations on tutor selection
        >
          <option value="">-- Select a Tutor --</option>
          {tutors.map((tutor) => (
            <option key={tutor.email} value={tutor.email}>
              {tutor.name} - {tutor.qualifications}
            </option>
          ))}
        </select>
      </div>
      {recommendedSlots.length > 0 && (
        <div className="recommendation-section">
          <h3>Recommended Time Slots:</h3>
          <ul>
            {recommendedSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </div>
      )}
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