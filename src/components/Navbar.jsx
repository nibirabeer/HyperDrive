import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDrawerOpen, setIsAboutDrawerOpen] = useState(false);
  const aboutDrawerRef = useRef(null); // Ref to track the About drawer

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAboutDrawer = () => {
    setIsAboutDrawerOpen(!isAboutDrawerOpen);
  };

  // Close About drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDrawerRef.current && !aboutDrawerRef.current.contains(event.target)) {
        setIsAboutDrawerOpen(false); // Close the About drawer
      }
    };

    // Add event listener when the About drawer is open
    if (isAboutDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAboutDrawerOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand Name */}
        <NavLink to="/Home" className="navbar-logo">
          <img
            src="/public/lb.png" // Replace with your logo
            alt="HyperDrive Logo"
          />
          <h1>HyperDrive</h1>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="navbar-toggle"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="navbar-toggle-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`navbar-menu ${isMenuOpen ? "active" : ""}`}
          id="navbar-menu"
        >
          <ul className="navbar-links">
            <li>
              <NavLink
                to="/Home"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>

            {/* Conditionally render Bookings and Profile links if logged in */}
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    to="/booking"
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? "active" : ""}`
                    }
                  >
                    Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Login"
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? "active" : ""}`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            ) : (
              // Render Login link if not logged in
              <li>
                <NavLink
                  to="/Login"
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "active" : ""}`
                  }
                >
                  Login
                </NavLink>
              </li>
            )}

            {/* About Button */}
            <li>
              <button
                onClick={toggleAboutDrawer}
                className="navbar-link about-button"
              >
                About
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* About Drawer */}
      {isAboutDrawerOpen && (
        <div className="about-drawer-overlay">
          <div className="about-drawer" ref={aboutDrawerRef}>
            <h2>About HyperDrive</h2>
            <p>
              HyperDrive is a cutting-edge platform designed to revolutionize your
              experience. With advanced features and intuitive design, we aim to
              provide the best service for our users.
            </p>
            <button onClick={toggleAboutDrawer} className="close-drawer-button">
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;