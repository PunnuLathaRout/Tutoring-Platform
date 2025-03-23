import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const [userName, setUserName] = useState(''); // State to store the logged-in user's name

  const handleLogin = (name) => {
    setUserName(name); // Set the logged-in user's name
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home userName={userName} />} />
      </Routes>
    </Router>
  );
}

export default App;