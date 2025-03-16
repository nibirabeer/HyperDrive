import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/Booking.css"; // Updated CSS file name

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to view bookings.");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }

        const bookingsCollectionRef = collection(userDocRef, "bookings");
        const bookingSnapshot = await getDocs(bookingsCollectionRef);
        const bookingList = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList);
      } catch (error) {
        console.error("Error fetching user or bookings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, [auth]);

  const handleCancelBooking = async (bookingId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to cancel bookings.");
      return;
    }
    
    try {
      const bookingDocRef = doc(db, "users", user.uid, "bookings", bookingId);
      await deleteDoc(bookingDocRef);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking: ", error);
    }
  };

  if (loading) {
    return <p className="booking-loading">Loading bookings...</p>;
  }

  return (
    <div className="booking-page-container">
      <h1 className="booking-page-heading">Your Bookings</h1>
      {userName && <h2 className="booking-welcome-message">Welcome, {userName}!</h2>}
      {bookings.length === 0 ? (
        <p className="booking-no-bookings">No bookings found.</p>
      ) : (
        <div className="booking-cards-container">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card-item">
              <img className="booking-car-image" src={booking.carPhotoURL} alt={booking.carName} />
              <div className="booking-card-details">
                <h2 className="booking-car-name">{booking.carName}</h2>
                <p className="booking-info"><strong>Date:</strong> {booking.rentalDate}</p>
                <p className="booking-info"><strong>Time:</strong> {booking.rentalTime}</p>
                <p className="booking-info"><strong>Duration:</strong> {booking.rentalDuration} hours</p>
                <p className="booking-info"><strong>Total Price:</strong> £{booking.totalPrice}</p>
                <button className="booking-cancel-button" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;