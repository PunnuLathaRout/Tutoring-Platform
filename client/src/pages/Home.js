import React from 'react';
import Header from '../pages/Header'; // Import Header component
import Footer from '../pages/Footer'; // Import Footer component
import './Home.css'; // Ensure you have a CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <Header /> {/* Use Header component */}
      <div className="home-content">
        <div className="section">
          <div className="text-content">
            <h2>Welcome to Learning Bridge</h2>
            <p>Your gateway to knowledge and learning.</p>
            <p>Easy-to-use learning software to help you achieve your learning goals.</p>
            <p>Make delivering engaging, impactful learning programs look easy, no matter your business goals – performance, retention, or growth – with Learning Bridge.</p>
            <ul>
              <li>Access a wide range of courses</li>
              <li>Learn from industry experts</li>
              <li>Join a community of learners</li>
            </ul>
          </div>
          <div className="image-content">
            <img src="https://plus.unsplash.com/premium_photo-1661761077411-d50cba031848?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Learning Platform" className="home-image" />
          </div>
        </div>
        <div className="section">
          <div className="image-content">
            <img src="https://www.sas.com/en_us/training/offers/free-training/_jcr_content/par/styledcontainer5968/par/styledcontainer_copy/par/image.img.jpg/1707501517161.jpg" alt="Learner Obsessed" className="home-image" />
          </div>
          <div className="text-content">
            <h2>As learner-obsessed as you are</h2>
            <p>With interactive features and a leading UI, use LearnUpon’s learner-centric solution to create easy, engaging, and enjoyable experiences that make your learner goals simpler to achieve.</p>
          </div>
        </div>
        <div className="section">
          <div className="text-content">
            <h2>All your learning in one place</h2>
            <p>Whoever you want to train, streamline and scale how your business manages learning by housing it all within a single, centralized solution.</p>
          </div>
          <div className="image-content">
            <img src="https://alison.com/ssr/assets/images/flms-programme/landing/landing-header.webp" alt="Centralized Learning" className="home-image" />
          </div>
        </div>
        <div className="section">
          <div className="image-content">
            <img src="https://b2662075.smushcdn.com/2662075/wp-content/uploads/@2x-Design-Deliver-graphic.jpg?lossy=0&strip=1&webp=1" alt="Design and Deliver" className="home-image" />
          </div>
          <div className="text-content">
            <h2>Design and deliver, without the effort</h2>
            <p>In just a few clicks, create dynamic content and build the courses you need; ready to automatically roll it out to your learners when and where they need it.</p>
          </div>
        </div>
        <div className="section">
          <div className="text-content">
            <h2>Connect the tools you use every day</h2>
            <p>Integrate LearnUpon with your preferred tools to unlock powerful automation, communication, and insights that help you make the most out of your learning programs.</p>
          </div>
          <div className="image-content">
            <img src="https://b2662075.smushcdn.com/2662075/wp-content/uploads/@2x-05-Connect-graphic.jpg?lossy=0&strip=1&webp=1" alt="Connect Tools" className="home-image" />
          </div>
        </div>
      </div>
      <Footer /> {/* Use Footer component */}
    </div>
  );
}

export default Home;