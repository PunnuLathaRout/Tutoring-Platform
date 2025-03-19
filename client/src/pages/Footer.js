import React from 'react';
import './Footer.css'; // Create a separate CSS file for footer styles

function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h3>Contact & Support</h3>
          <p>Email: <a href="mailto:support@tutorfinder.com">support@LearningBridge.com</a></p>
          <p>Phone: <a href="tel:+1800">+1-800-TUTOR-HELP</a></p>
        </div>
        <div className="footer-section">
          <h3>Legal & Policies</h3>
          <p><a href="/">Terms of Service</a></p>
          <p><a href="/">Privacy Policy</a></p>
          <p><a href="/">Refund & Cancellation Policy</a></p>
          <p><a href="/">Community Guidelines</a></p>
        </div>
        <div className="footer-section">
          <h3>Social Media Links</h3>
          <p>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 LearningBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;