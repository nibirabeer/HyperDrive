import React, { useState } from "react";
import UserManagement from "../components/UserManagement";
import CarsManagement from "../components/CarsManagement";
import BookingManagement from "../components/BookingManagement"; // Import BookingManagement
import "../styles/AdminPanel.css"; // Link the external CSS

const AdminPanel = () => {
  // State to manage the active section
  const [activeSection, setActiveSection] = useState("userManagement");

  // Function to handle button click and set active section
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="admin-panel">
      {/* Content wrapper for centering */}
      <div className="content-wrapper">
        {/* Heading */}
        <h1 className="admin-heading">Admin Panel</h1>

        {/* Toggle buttons */}
        <div className="toggle-buttons">
          <button
            type="button"
            className={`toggle-btn ${activeSection === "userManagement" ? "active" : ""}`}
            onClick={() => handleButtonClick("userManagement")}
          >
            User Management
          </button>
          <button
            type="button"
            className={`toggle-btn ${activeSection === "carsManagement" ? "active" : ""}`}
            onClick={() => handleButtonClick("carsManagement")}
          >
            Cars Management
          </button>
          <button
            type="button"
            className={`toggle-btn ${activeSection === "bookingManagement" ? "active" : ""}`}
            onClick={() => handleButtonClick("bookingManagement")}
          >
            All Bookings
          </button>
        </div>

        {/* Conditional rendering based on active section */}
        {activeSection === "userManagement" && <UserManagement />}
        {activeSection === "carsManagement" && <CarsManagement />}
        {activeSection === "bookingManagement" && <BookingManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
