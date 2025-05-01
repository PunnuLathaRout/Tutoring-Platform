const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Correctly import the database.js file
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule'); // Import node-schedule for scheduling reminders

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files only if the build directory exists
const buildPath = path.join(__dirname, '../client/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// In-memory storage for notifications (use a database in production)
const notifications = [];

// Function to schedule reminders
function scheduleReminders() {
  db.all("SELECT * FROM bookings", [], (err, bookings) => {
    if (err) {
      console.error('Error fetching bookings for reminders:', err);
      return;
    }

    bookings.forEach((booking) => {
      const bookingTime = new Date(`${booking.date}T${booking.time}`);
      const reminderTime = new Date(bookingTime.getTime() - 15 * 60 * 1000); // 15 minutes before booking

      if (reminderTime > new Date()) {
        schedule.scheduleJob(reminderTime, () => {
          notifications.push({
            recipient: booking.studentEmail,
            message: `Reminder: Your session with the tutor (${booking.tutorEmail}) is scheduled for ${booking.date} at ${booking.time}.`,
          });
          notifications.push({
            recipient: booking.tutorEmail,
            message: `Reminder: Your session with the student (${booking.studentEmail}) is scheduled for ${booking.date} at ${booking.time}.`,
          });

          console.log(`Reminder notifications sent for booking ID: ${booking.id}`);
        });
      }
    });
  });
}

// Ensure availability and subjects are set for all tutors
function ensureTutorData() {
  const randomTimes = ['09:00', '10:00', '11:00'];
  const randomSubjects = ['Math', 'Science', 'English'];

  db.all("SELECT id, availability, subject FROM tutors", [], (err, tutors) => {
    if (err) {
      console.error('Error fetching tutors:', err);
      return;
    }

    tutors.forEach(tutor => {
      const updates = [];
      const params = [];

      if (!tutor.availability) {
        updates.push("availability = ?");
        params.push(randomTimes[Math.floor(Math.random() * randomTimes.length)]);
      }

      if (!tutor.subject) {
        updates.push("subject = ?");
        params.push(randomSubjects[Math.floor(Math.random() * randomSubjects.length)]);
      }

      if (updates.length > 0) {
        const updateQuery = `UPDATE tutors SET ${updates.join(", ")} WHERE id = ?`;
        params.push(tutor.id);

        db.run(updateQuery, params, (err) => {
          if (err) {
            console.error(`Error updating tutor ID ${tutor.id}:`, err);
          }
        });
      }
    });
  });
}

// Call the function to ensure tutor data is populated
ensureTutorData();

// Call the function to schedule reminders
scheduleReminders();

// Register User (Student)
app.post('/api/register', (req, res) => {
  const { fullName, email, password } = req.body;
  console.log('Register student request:', req.body);

  db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User signed up successfully' });
    });
  });
});

// Register Tutor
app.post('/api/register-tutor', (req, res) => {
  const { fullName, email, password } = req.body;
  console.log('Register tutor request:', req.body);

  db.get("SELECT email FROM tutors WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'Tutor already exists' });
    }

    db.run("INSERT INTO tutors (name, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Tutor signed up successfully' });
    });
  });
});

// Login User/Tutor
app.post('/api/login', (req, res) => {
  const { email, password, userType } = req.body;
  console.log('Login request received:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  let query;
  let params;

  if (userType === 'tutor') {
    query = `SELECT name, email FROM tutors WHERE email = ? AND password = ?`;
    params = [email, password];
  } else if (userType === 'student') {
    query = `SELECT name, email FROM users WHERE email = ? AND password = ?`;
    params = [email, password];
  } else {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  db.get(query, params, (err, row) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      name: row.name || null,
      email: row.email,
      userType: userType,
    });
  });
});

// Fetch tutors with optional search functionality
app.get('/api/tutors', (req, res) => {
  const { search } = req.query;

  let query = "SELECT * FROM tutors";
  const params = [];

  if (search) {
    query += " WHERE LOWER(name) LIKE ? OR CAST(hourlyRate AS TEXT) LIKE ?";
    const searchParam = `%${search.toLowerCase()}%`;
    params.push(searchParam, searchParam);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching tutors:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log('Fetched tutors:', rows); // Log fetched tutors for debugging
    res.status(200).json(rows);
  });
});

// Fetch 3 random tutors
app.get('/api/random-tutors', (req, res) => {
  const query = "SELECT * FROM tutors ORDER BY RANDOM() LIMIT 3";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching random tutors:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Add random availability and subjects
    const updatedRows = rows.map(tutor => ({
      ...tutor,
      availability: ['09:00', '10:00', '11:00'][Math.floor(Math.random() * 3)], // Random time
      subject: ['Math', 'Science', 'English'][Math.floor(Math.random() * 3)] // Random subject
    }));

    res.status(200).json(updatedRows);
  });
});

// Fetch recommended slots for a student and tutor
app.get('/api/recommend-slots', (req, res) => {
  const { studentEmail, tutorEmail } = req.query;

  if (!studentEmail || !tutorEmail) {
    return res.status(400).json({ message: 'Student email and tutor email are required' });
  }

  const query = `
    SELECT slot
    FROM recommended_slots
    WHERE studentEmail = ? AND tutorEmail = ?
    ORDER BY slot
  `;

  db.all(query, [studentEmail, tutorEmail], (err, rows) => {
    if (err) {
      console.error('Error fetching recommended slots:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    const recommendedSlots = rows.map(row => row.slot);
    res.status(200).json({ recommendedSlots });
  });
});

// Add a new tutor
app.post('/api/tutors', (req, res) => {
  const { name, qualifications, hourlyRate, email } = req.body;

  db.run("INSERT INTO tutors (name, qualifications, hourlyRate, email) VALUES (?, ?, ?, ?)", [name, qualifications, hourlyRate, email], (err) => {
    if (err) {
      console.error('Error adding tutor:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Tutor added successfully' });
  });
});

// Profile
app.get('/api/profile', (req, res) => {
  const userEmail = req.headers['user-email'];
  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  const tutorQuery = `
    SELECT name, email, 'tutor' AS userType, qualifications, hourlyRate, availability, subject
    FROM tutors
    WHERE email = ?
  `;
  const studentQuery = `
    SELECT name, email, 'student' AS userType
    FROM users
    WHERE email = ?
  `;

  db.get(tutorQuery, [userEmail], (err, tutorRow) => {
    if (err) {
      console.error('Error fetching tutor profile:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (tutorRow) {
      return res.status(200).json(tutorRow);
    }

    db.get(studentQuery, [userEmail], (err, studentRow) => {
      if (err) {
        console.error('Error fetching student profile:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (studentRow) {
        return res.status(200).json(studentRow);
      }

      return res.status(404).json({ message: 'Profile not found' });
    });
  });
});

// Update Profile
app.put('/api/profile/password', (req, res) => {
  const { email, currentPassword, newPassword, qualifications, hourlyRate, availability } = req.body;

  if (!email || !currentPassword) {
    return res.status(400).json({ message: 'Email and current password are required' });
  }

  const query = `SELECT password FROM users WHERE email = ? UNION SELECT password FROM tutors WHERE email = ?`;
  db.get(query, [email, email], (err, row) => {
    if (err) {
      console.error('Error verifying current password:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row || row.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const updateUsersQuery = `UPDATE users SET password = COALESCE(?, password) WHERE email = ?`;
    db.run(updateUsersQuery, [newPassword, email], function (err) {
      if (err) {
        console.error('Error updating password in users table:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        const updateTutorsQuery = `
          UPDATE tutors
          SET password = COALESCE(?, password), 
              qualifications = COALESCE(?, qualifications), 
              hourlyRate = COALESCE(?, hourlyRate),
              availability = COALESCE(?, availability)
          WHERE email = ?
        `;
        db.run(updateTutorsQuery, [newPassword, qualifications, hourlyRate, availability, email], function (err) {
          if (err) {
            console.error('Error updating tutor details:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          if (this.changes === 0) {
            return res.status(400).json({ message: 'No changes were made or invalid email' });
          }

          db.get(`SELECT * FROM tutors WHERE email = ?`, [email], (err, updatedTutor) => {
            if (err) {
              console.error('Error fetching updated tutor data:', err);
              return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'Profile updated successfully', data: updatedTutor });
          });
        });
      } else {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, updatedUser) => {
          if (err) {
            console.error('Error fetching updated user data:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          res.status(200).json({ message: 'Profile updated successfully', data: updatedUser });
        });
      }
    });
  });
});

// Add a new booking with notifications
app.post('/api/bookings', (req, res) => {
  const { studentEmail, tutorEmail, date, time } = req.body;

  if (!studentEmail || !tutorEmail || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertBookingQuery = `
    INSERT INTO bookings (studentEmail, tutorEmail, date, time)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertBookingQuery, [studentEmail, tutorEmail, date, time], (err) => {
    if (err) {
      console.error('Error adding booking:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Add confirmation notifications
    const studentNotification = `You have booked the teacher ${tutorEmail} for ${date} at ${time}.`;
    const tutorNotification = `Student ${studentEmail} has booked you for ${date} at ${time}.`;

    notifications.push({
      recipient: studentEmail,
      message: studentNotification,
    });
    notifications.push({
      recipient: tutorEmail,
      message: tutorNotification,
    });

    // Print notifications in the terminal
    console.log('Notification for student:', studentNotification);
    console.log('Notification for tutor:', tutorNotification);

    res.status(201).json({ message: 'Booking created successfully' });
  });
});

// Cancel a booking with notifications
app.post('/api/bookings/cancel', (req, res) => {
  const { bookingId, studentEmail, tutorEmail } = req.body;

  if (!bookingId || !studentEmail || !tutorEmail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const deleteBookingQuery = `DELETE FROM bookings WHERE id = ?`;

  db.run(deleteBookingQuery, [bookingId], (err) => {
    if (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Add cancellation notifications
    notifications.push({
      recipient: studentEmail,
      message: `You have canceled your class with the tutor (${tutorEmail}).`,
    });
    notifications.push({
      recipient: tutorEmail,
      message: `The student (${studentEmail}) has canceled their class with you.`,
    });

    console.log('Cancellation notifications sent for booking ID:', bookingId);
    res.status(200).json({ message: 'Booking canceled successfully' });
  });
});

// Send reminder notifications
app.post('/api/bookings/reminders', (req, res) => {
  const { studentEmail, tutorEmail, date, time } = req.body;

  if (!studentEmail || !tutorEmail || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Add reminder notifications
  notifications.push({
    recipient: studentEmail,
    message: `Reminder: Your session with the tutor (${tutorEmail}) is scheduled for ${date} at ${time}.`,
  });
  notifications.push({
    recipient: tutorEmail,
    message: `Reminder: Your session with the student (${studentEmail}) is scheduled for ${date} at ${time}.`,
  });

  res.status(200).json({ message: 'Reminders sent successfully' });
});

// Fetch notifications for a specific user
app.get('/api/notifications', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const userNotifications = notifications.filter(
    (notification) => notification.recipient === email
  );

  res.status(200).json(userNotifications); // Return notifications as an array
});

// Fetch bookings for a specific tutor
app.get('/api/bookings/:tutorEmail', (req, res) => {
  const { tutorEmail } = req.params;

  const fetchBookingsQuery = `
    SELECT * FROM bookings WHERE tutorEmail = ?
  `;

  db.all(fetchBookingsQuery, [tutorEmail], (err, rows) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(rows);
  });
});

// Fetch bookings for a specific student
app.get('/api/bookings/student/:studentEmail', (req, res) => {
  const { studentEmail } = req.params;

  console.log('Fetching bookings for studentEmail:', studentEmail); // Log the studentEmail

  const fetchBookingsQuery = `
    SELECT b.id, b.date, b.time, t.name AS tutorName, t.email AS tutorEmail, t.qualifications, t.hourlyRate
    FROM bookings b
    JOIN tutors t ON b.tutorEmail = t.email
    WHERE b.studentEmail = ?
  `;

  db.all(fetchBookingsQuery, [studentEmail], (err, rows) => {
    if (err) {
      console.error('Error fetching bookings:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Fetched bookings:', rows); // Log the fetched rows
    res.status(200).json(rows);
  });
});

// Fetch a specific tutor's profile by email
app.get('/api/tutor/:email', (req, res) => {
  const { email } = req.params;

  const query = `
    SELECT name, email, qualifications, hourlyRate, availability, subject, rating
    FROM tutors
    WHERE email = ?
  `;

  db.get(query, [email], (err, tutor) => {
    if (err) {
      console.error('Error fetching tutor profile:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.status(200).json(tutor);
  });
});

// Fetch a tutor's profile for students
app.get('/api/tutor-profile/:email', (req, res) => {
  const { email } = req.params;

  console.log(`Fetching profile for tutor with email: ${email}`); // Debug log

  const query = `
    SELECT name, email, qualifications, hourlyRate, availability, subject, rating
    FROM tutors
    WHERE email = ?
  `;

  db.get(query, [email], (err, tutor) => {
    if (err) {
      console.error('Error fetching tutor profile:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!tutor) {
      console.warn(`Tutor not found for email: ${email}`); // Debug log
      return res.status(404).json({ message: 'Tutor not found' });
    }

    console.log(`Tutor profile fetched successfully for email: ${email}`); // Debug log

    // Respond with the tutor's profile
    res.status(200).json({
      name: tutor.name,
      email: tutor.email,
      qualifications: tutor.qualifications,
      hourlyRate: tutor.hourlyRate,
      availability: tutor.availability,
      subject: tutor.subject,
      rating: tutor.rating,
    });
  });
});

// Update tutor rating
app.post('/api/rate-tutor', (req, res) => {
  const { tutorEmail, rating } = req.body;

  if (!tutorEmail || !rating) {
    return res.status(400).json({ message: 'Tutor email and rating are required' });
  }

  const updateRatingQuery = `
    UPDATE tutors
    SET rating = CASE
      WHEN rating IS NULL THEN ?
      ELSE (rating + ?) / 2
    END
    WHERE email = ?
  `;

  db.run(updateRatingQuery, [rating, rating, tutorEmail], function (err) {
    if (err) {
      console.error('Error updating rating:', err.message);
      return res.status(500).json({ message: 'Failed to update rating' });
    }
    res.json({ message: 'Rating updated successfully' });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});