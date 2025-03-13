import React from 'react';
import './Home.css';

function Home({ onLoginClick }) {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Learning Bridge</div>
        <nav className="nav-links">
          <a href="#platform">Platform <span className="dropdown-arrow">▼</span></a>
          <a href="#solutions">Solutions <span className="dropdown-arrow">▼</span></a>
          <a href="#difference">Our Difference <span className="dropdown-arrow">▼</span></a>
          <a href="#resources">Resources <span className="dropdown-arrow">▼</span></a>
          <a href="#pricing">Pricing</a>
          <a href="#login" onClick={onLoginClick}>Login</a>
        </nav>
      </header>
      <main className="home-content">
        <h2>Enhance Your Skills with Our Platform</h2>
        <p>
          Discover how our personalized demo can help you achieve your goals. We'll cover:
        </p>
        <ul>
          <li>Your current challenges</li>
          <li>How Learning Bridge can support your growth</li>
        </ul>
        <p>
          We offer a consultative approach to ensure you make the best decision for your needs. Let's discuss!
        </p>
      </main>
    </div>
  );
}

export default Home;