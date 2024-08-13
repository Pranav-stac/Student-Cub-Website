import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="full-screen-div">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">Coding Club</div>
          <div className="nav-links">
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </nav>
      <div className="content">
        <div className="text-content">
          <h1>Welcome to the Coding Club</h1>
          <p>Your journey to coding excellence starts here.</p>
          <p>Join us to enhance your coding skills, participate in hackathons, and collaborate on exciting projects!</p>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
        <div className="image-content">
          <img src={`${process.env.PUBLIC_URL}/vecteezy_programmer-people-concept-use-laptop-and-programming-code_.jpg`} alt="Coding" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
