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
app.post('/api/login', (req, res) => {
  const { email, password, userType } = req.body; // Include userType in the request
  console.log('Login request:', req.body);

  const table = userType === 'tutor' ? 'tutors' : 'users'; // Determine the table to query

  db.get(`SELECT name, email FROM ${table} WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) {
      console.log('Invalid email or password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log('Login successful:', row);
    res.status(200).json({ message: 'Login successful', name: row.name }); // Include the name in the response
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

// Login User
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', req.body); // Log the request body
  
  db.get("SELECT email FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) {
      console.error('Error during login:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) {
      console.log('Invalid email or password'); // Log invalid login attempt
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log('Login successful:', row); // Log successful login
    res.status(200).json({ message: 'Login successful' });
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