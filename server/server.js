const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Correctly import the database.js file
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

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

// Fetch tutors from the database
app.get('/api/tutors', (req, res) => {
  db.all("SELECT * FROM tutors", [], (err, rows) => {
    if (err) {
      console.error('Error fetching tutors:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(rows);
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

  const tutorQuery = `SELECT name, email, 'tutor' AS userType, qualifications, hourlyRate, availability FROM tutors WHERE email = ?`;
  const studentQuery = `SELECT name, email, 'student' AS userType FROM users WHERE email = ?`;

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

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});