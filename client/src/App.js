import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const handleLogin = () => {
    console.log('User logged in');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
      </Routes>
    </Router>
  );
}

export default App;