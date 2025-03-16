import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../styles/LoggedNavbar.css";

const LoggedNavbar = ({ isLoggedIn, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(""); // State to store profile photo URL
  const [userName, setUserName] = useState(""); // State to store user name
  const [userEmail, setUserEmail] = useState(""); // State to store user email
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref to track the dropdown menu

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Fetch user data
          const userData = userDoc.data();

          // Check if the user is an admin
          if (userData.admin) {
            setIsAdmin(true);
          }

          // Fetch the profile photo URL
          if (userData.photoURL) {
            setProfilePhoto(userData.photoURL);
          }

          // Set user email and name
          setUserName(userData.name); // Assuming 'name' is a field in your Firestore document
          setUserEmail(userData.email); // Assuming 'email' is a field in your Firestore document
        }
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    onLogout(); // Perform logout actions
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="logged-navbar-unique">
      <div className="logged-navbar-container-unique">
        {/* Logo and Brand Name */}
        <NavLink to="/Home" className="logged-navbar-logo-unique">
          <img
            src="/public/lb.png" // Replace with your logo
            alt="HyperDrive Logo"
          />
          <h1>HyperDrive</h1>
        </NavLink>

        {/* Navigation Menu */}
        <div className="logged-navbar-menu-unique">
          <ul className="logged-navbar-links-unique">
            <li>
              <NavLink
                to="/Home"
                className={({ isActive }) =>
                  `logged-navbar-link-unique ${isActive ? "active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  `logged-navbar-link-unique ${isActive ? "active" : ""}`
                }
              >
                Bookings
              </NavLink>
            </li>

            {/* Show Admin Panel Link if User is Admin */}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `logged-navbar-link-unique ${isActive ? "active" : ""}`
                  }
                >
                  Admin Panel
                </NavLink>
              </li>
            )}

            {/* Profile Dropdown */}
            {isLoggedIn && (
              <li className="logged-navbar-profile-unique" ref={dropdownRef}>
                {/* Display the user's profile photo */}
                <img
                  src={profilePhoto || "/path/to/default-profile-image.jpg"} // Use the profile photo URL or a default image
                  alt="Profile"
                  className="logged-navbar-profile-img-unique"
                  onClick={toggleProfileDropdown}
                />
                {isProfileOpen && (
                  <ul className="logged-navbar-dropdown-unique">
                    {/* Show user name and email */}
                    <li>
                      <span className="logged-navbar-dropdown-text">
                        <strong>{userName}</strong>
                      </span>
                    </li>
                    <li>
                      <span className="logged-navbar-dropdown-text">
                        <em>{userEmail}</em>
                      </span>
                    </li>

                    <li>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `logged-navbar-link-unique ${isActive ? "active" : ""}`
                        }
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `logged-navbar-link-unique ${isActive ? "active" : ""}`
                        }
                      >
                        View Profile
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="logged-navbar-link-unique">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LoggedNavbar;
