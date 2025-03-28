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
  console.log('Register student request:', req.body); // Log the request body

  // Check if the student already exists
  db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error('Error during registration:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Insert the new student into the database
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err) => {
      if (err) {
        console.error('Error during registration:', err); // Log the error
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User signed up successfully' });
    });
  });
});

// Register Tutor
app.post('/api/register-tutor', (req, res) => {
  const { fullName, email, password } = req.body;
  console.log('Register tutor request:', req.body); // Log the request body
  
  db.get("SELECT email FROM tutors WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error('Error during registration:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'Tutor already exists' });
    }
    db.run("INSERT INTO tutors (name, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err) => {
      if (err) {
        console.error('Error during registration:', err); // Log the error
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Tutor signed up successfully' });
    });
  });
});

// Login User/Tutor
/// Login User/Tutor
app.post('/api/login', (req, res) => {
  const { email, password, userType } = req.body;
  console.log('Login request received:', req.body);

  // Validate email and password
  if (!email || !password) {
    console.error('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Determine the table to query based on userType
  let query;
  let params;

  if (userType === 'tutor') {
    query = `SELECT name, email FROM tutors WHERE email = ? AND password = ?`;
    params = [email, password];
    console.log(`Querying tutors table for email: ${email}`);
  } else if (userType === 'student') {
    query = `SELECT name, email FROM users WHERE email = ? AND password = ?`;
    params = [email, password];
    console.log(`Querying users table for email: ${email}`);
  } else {
    // If userType is missing or invalid, check both tables
    console.log('UserType is missing or invalid. Checking both tables.');
    const tutorQuery = `SELECT name, email FROM tutors WHERE email = ? AND password = ?`;
    const userQuery = `SELECT name, email FROM users WHERE email = ? AND password = ?`;

    // Check tutors table first
    db.get(tutorQuery, [email, password], (err, tutorRow) => {
      if (err) {
        console.error('Error during login (tutors):', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (tutorRow) {
        console.log('Login successful (tutor):', tutorRow);
        return res.status(200).json({
          message: 'Login successful',
          name: tutorRow.name || null,
          userType: 'tutor',
        });
      }

      // If not found in tutors, check users table
      db.get(userQuery, [email, password], (err, userRow) => {
        if (err) {
          console.error('Error during login (users):', err);
          return res.status(500).json({ message: 'Database error' });
        }
        if (userRow) {
          console.log('Login successful (student):', userRow);
          return res.status(200).json({
            message: 'Login successful',
            name: userRow.name || null,
            userType: 'student',
          });
        }

        // If not found in either table
        console.log('Invalid email or password');
        return res.status(400).json({ message: 'Invalid email or password' });
      });
    });

    return; // Exit early since we're handling both queries above
  }

  // Query the appropriate table based on userType
  db.get(query, params, (err, row) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) {
      console.log(`Invalid email or password for userType: ${userType}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log('Login successful:', row);
    res.status(200).json({
      message: 'Login successful',
      name: row.name || null, // Include the name if available
      userType: userType, // Include userType in the response
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
    console.log('Fetched tutors:', rows); // Log fetched tutor data
    res.status(200).json(rows);
  });
});

// Add a new tutor
app.post('/api/tutors', (req, res) => {
  const { name, qualifications, hourlyRate, email } = req.body;
  console.log('Add tutor request:', req.body); // Log the request body

  db.run("INSERT INTO tutors (name, qualifications, hourlyRate, email) VALUES (?, ?, ?, ?)", [name, qualifications, hourlyRate, email], (err) => {
    if (err) {
      console.error('Error adding tutor:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Tutor added successfully' });
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