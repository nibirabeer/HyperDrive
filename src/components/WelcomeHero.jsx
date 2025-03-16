import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/WelcomeHero.css"; // Import the CSS for styling

const WelcomeHero = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleExploreClick = () => {
    navigate("/dashboard"); // Redirect to the Dashboard page
  };

  return (
    <div className="welcome-hero">
      <div className="welcome-hero-content">
        <h1 className="welcome-hero-title">
          Welcome to <span className="highlight">HyperDrive</span>
        </h1>
        <p className="welcome-hero-subtitle">
          Book your dream supercar today and experience the thrill of the ride!
        </p>
        <button className="welcome-hero-button" onClick={handleExploreClick}>
          Explore Cars
        </button>
      </div>
    </div>
  );
};

export default WelcomeHero;