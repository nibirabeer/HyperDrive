import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react'; // Import the close icon
import '../styles/Footer.css';

const Footer = () => {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [contactDetails, setContactDetails] = useState('');
  const contactDrawerRef = useRef(null);

  // Close the drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactDrawerRef.current && !contactDrawerRef.current.contains(event.target)) {
        setIsContactDrawerOpen(false); // Close the drawer
      }
    };

    // Add event listener when the drawer is open
    if (isContactDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactDrawerOpen]);

  const handleContactClick = () => {
    setIsContactDrawerOpen(true); // Open the drawer
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:abirnibir10@gmail.com?subject=Contact Us&body=${encodeURIComponent(contactDetails)}`;
    window.location.href = mailtoLink; // Open the default email client
    setIsContactDrawerOpen(false); // Close the drawer after sending
  };

  const handleCloseDrawer = () => {
    setIsContactDrawerOpen(false); // Close the drawer
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-logo">HyperDrive</h3>
          <p className="footer-description">
            Your premier destination for luxury car rentals. Experience the thrill of driving the world's most exotic cars.
          </p>
        </div>

        <div className="footer-middle">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/Home">Home</a></li>
            <li>
              <button onClick={handleContactClick} className="footer-link-button">
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-right">
          <h4 className="footer-title">Follow Us</h4>
          <ul className="footer-social">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hyper Drive. All rights reserved.</p>
      </div>

      {/* Contact Us Drawer */}
      {isContactDrawerOpen && (
        <div className="contact-drawer-overlay">
          <div className="contact-drawer" ref={contactDrawerRef}>
            <button onClick={handleCloseDrawer} className="close-drawer-icon">
              <X size={24} /> {/* Close icon */}
            </button>
            <h2>Contact Us</h2>
            <p>Have any questions or concerns? Feel free to reach out to us!</p>
            <textarea
              placeholder="Enter your message..."
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              className="contact-drawer-input"
            />
            <button onClick={handleSendEmail} className="contact-drawer-button">
              Send
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;