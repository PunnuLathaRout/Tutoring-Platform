import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '', // Current password (for updating)
    newPassword: '', // New password (for updating)
    qualifications: '', // For tutors
    hourlyRate: '', // For tutors
    availability: '', // For tutors
    subject: '', // Add subject field
    rating: 0, // Add rating field (read-only)
    userType: '', // To determine if the user is a tutor or student
  });
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
        setProfileData(data); // Populate the form with fetched data
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || 'An error occurred while fetching profile.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage

    // Prepare the payload with only the updated fields
    const payload = {
      email: userEmail,
      currentPassword: profileData.password,
    };
    if (profileData.newPassword) payload.newPassword = profileData.newPassword;
    if (profileData.qualifications) payload.qualifications = profileData.qualifications;
    if (profileData.hourlyRate) payload.hourlyRate = profileData.hourlyRate;
    if (profileData.availability) payload.availability = profileData.availability;
    if (profileData.subject) payload.subject = profileData.subject; // Include subject

    console.log('Request payload:', payload);

    fetch('/api/profile/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Failed to save profile');
          });
        }
        return response.json();
      })
      .then((data) => {
        alert('Profile updated successfully!');
        setProfileData((prevData) => ({
          ...prevData,
          ...data.data, // Update the state with the updated data from the backend
        }));
      })
      .catch((error) => {
        console.error('Error saving profile:', error.message);
        alert(error.message);
      });
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/'); // Redirect to login page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src="https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215.jpg?w=740"
            alt="Default Avatar"
          />
        </div>
        <h1>{profileData.name}</h1>
      </div>
      <div className="profile-details">
        <label>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </label>
        <label>
          <strong>Email:</strong>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </label>
        {profileData.userType === 'tutor' && (
          <>
            <label>
              <strong>Qualifications:</strong>
              <input
                type="text"
                name="qualifications"
                value={profileData.qualifications}
                onChange={handleInputChange}
                placeholder="Enter your qualifications"
              />
            </label>
            <label>
              <strong>Hourly Rate:</strong>
              <input
                type="number"
                name="hourlyRate"
                value={profileData.hourlyRate}
                onChange={handleInputChange}
                placeholder="Enter your hourly rate"
              />
            </label>
            <label>
              <strong>Availability:</strong>
              <input
                type="text"
                name="availability"
                value={profileData.availability}
                onChange={handleInputChange}
                placeholder="Enter your availability (e.g., Mon-Fri, 9 AM - 5 PM)"
              />
            </label>
            <label>
              <strong>Subject:</strong>
              <input
                type="text"
                name="subject"
                value={profileData.subject}
                onChange={handleInputChange}
                placeholder="Enter the subject you teach"
              />
            </label>
            <label>
              <strong>Rating:</strong>
              <input
                type="number"
                name="rating"
                value={profileData.rating}
                readOnly
              />
            </label>
          </>
        )}
        <label>
          <strong>Current Password:</strong>
          <input
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleInputChange}
            placeholder="Enter your current password"
          />
        </label>
        <label>
          <strong>New Password:</strong>
          <input
            type="password"
            name="newPassword"
            value={profileData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter your new password"
          />
        </label>
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
      <button className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default Profile;