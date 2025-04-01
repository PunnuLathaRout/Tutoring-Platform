import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage

    fetch('/api/profile', {
      method: 'GET',
      headers: {
        'user-email': userEmail, // Send the email in the headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Profile data:', data);
        setProfileData(data); // Correctly update the profileData state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError(error.message || 'An error occurred while fetching profile.');
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>User Type:</strong> {profileData.userType}</p>
        {profileData.userType === 'tutor' && (
          <>
            <p><strong>Qualifications:</strong> {profileData.qualifications}</p>
            <p><strong>Hourly Rate:</strong> {profileData.hourlyRate}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;