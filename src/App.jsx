import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./services/firebase"; // Import Firebase auth
import Navbar from "./components/Navbar";
import LoggedNavbar from "./components/LoggedNavbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check Firebase authentication state on app load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase
      setIsLoggedIn(false); // Update the login state to false
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Conditionally render Navbar or LoggedNavbar based on isLoggedIn */}
        {isLoggedIn ? (
          <LoggedNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        ) : (
          <Navbar isLoggedIn={isLoggedIn} />
        )}

        <Routes>
          {/* Pass isLoggedIn to the Home component */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />} />

          <Route path="/booking" element={<Booking />} />

          {/* Pass setIsLoggedIn to the Login component */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Add Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Add more routes as needed */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;