import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BookTeacher from './pages/BookTeacher';
import MyClasses from './pages/MyClasses';
import Notifications from './pages/Notifications'; // Import Notifications page

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
        <Route path="/bookteacher" element={<BookTeacher />} /> {/* Add BookTeacher route */}
        <Route path="/my-classes" element={<MyClasses />} /> {/* Add MyClasses route */}
        <Route path="/notifications" element={<Notifications />} /> {/* Add Notifications route */}
      </Routes>
    </Router>
  ); 
}

export default App;