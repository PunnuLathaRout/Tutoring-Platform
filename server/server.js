const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  console.log('Register request:', req.body); // Log the request body
  db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error('Error during registration:', err); // Log the error
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    }
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
      if (err) {
        console.error('Error during registration:', err); // Log the error
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User signed up successfully' });
    });
  });
});

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

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});