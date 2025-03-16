import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "../styles/BookingManagement.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({
    rentalDate: "",
    rentalTime: "",
    rentalDuration: "",
    totalPrice: "", // Added price field
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);
        let allBookings = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();
          const userName = userData.name || "Unknown User";

          const bookingsCollectionRef = collection(db, `users/${userId}/bookings`);
          const bookingSnapshot = await getDocs(bookingsCollectionRef);

          const userBookings = bookingSnapshot.docs.map((doc) => ({
            id: doc.id,
            userId,
            userName,
            ...doc.data(),
          }));

          allBookings = [...allBookings, ...userBookings];
        }

        setBookings(allBookings);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteBooking = async (userId, bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteDoc(doc(db, `users/${userId}/bookings`, bookingId));
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        alert("Booking deleted successfully!");
      } catch (error) {
        console.error("Error deleting booking: ", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  const handleUpdateBooking = async (userId, bookingId) => {
    if (
      !updatedBooking.rentalDate ||
      !updatedBooking.rentalTime ||
      !updatedBooking.rentalDuration ||
      !updatedBooking.totalPrice // Added validation for price
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const bookingRef = doc(db, `users/${userId}/bookings`, bookingId);
      await updateDoc(bookingRef, updatedBooking);

      alert("Booking updated successfully!");
      setEditingBookingId(null);
      setUpdatedBooking({
        rentalDate: "",
        rentalTime: "",
        rentalDuration: "",
        totalPrice: "", // Reset price field
      });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking: ", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="booking-management-container">
      <h2 className="booking-management-heading">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="booking-management-empty">No bookings found.</p>
      ) : (
        <div className="booking-management-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-management-card">
              <img
                src={booking.carPhotoURL}
                alt={booking.carName}
                className="booking-management-card-image"
              />
              <div className="booking-management-card-details">
                <h3 className="booking-management-card-title">{booking.carName}</h3>
                <p className="booking-management-card-user"><strong>User:</strong> {booking.userName}</p>
                <p className="booking-management-card-date"><strong>Date:</strong> {booking.rentalDate}</p>
                <p className="booking-management-card-time"><strong>Time:</strong> {booking.rentalTime}</p>
                <p className="booking-management-card-duration">
                  <strong>Duration:</strong> {booking.rentalDuration} hours
                </p>
                <p className="booking-management-card-price">
                  <strong>Total Price:</strong> £{booking.totalPrice}
                </p>
                <div className="booking-management-card-actions">
                  <button
                    className="booking-management-card-edit-button"
                    onClick={() => {
                      setEditingBookingId(booking.id);
                      setUpdatedBooking({
                        rentalDate: booking.rentalDate,
                        rentalTime: booking.rentalTime,
                        rentalDuration: booking.rentalDuration,
                        totalPrice: booking.totalPrice, // Set initial price value
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="booking-management-card-delete-button"
                    onClick={() => handleDeleteBooking(booking.userId, booking.id)}
                  >
                    Delete
                  </button>
                </div>
                {editingBookingId === booking.id && (
                  <div className="booking-management-edit-form">
                    <label className="booking-management-edit-label">
                      Rental Date:
                      <input
                        type="date"
                        value={updatedBooking.rentalDate}
                        onChange={(e) =>
                          setUpdatedBooking({ ...updatedBooking, rentalDate: e.target.value })
                        }
                        className="booking-management-edit-input"
                      />
                    </label>
                    <label className="booking-management-edit-label">
                      Rental Time:
                      <input
                        type="time"
                        value={updatedBooking.rentalTime}
                        onChange={(e) =>
                          setUpdatedBooking({ ...updatedBooking, rentalTime: e.target.value })
                        }
                        className="booking-management-edit-input"
                      />
                    </label>
                    <label className="booking-management-edit-label">
                      Rental Duration (hours):
                      <input
                        type="number"
                        value={updatedBooking.rentalDuration}
                        onChange={(e) =>
                          setUpdatedBooking({ ...updatedBooking, rentalDuration: e.target.value })
                        }
                        min="1"
                        className="booking-management-edit-input"
                      />
                    </label>
                    <label className="booking-management-edit-label">
                      Total Price (£):
                      <input
                        type="number"
                        value={updatedBooking.totalPrice}
                        onChange={(e) =>
                          setUpdatedBooking({ ...updatedBooking, totalPrice: e.target.value })
                        }
                        min="0"
                        step="0.01"
                        className="booking-management-edit-input"
                      />
                    </label>
                    <div className="booking-management-edit-buttons">
                      <button
                        className="booking-management-edit-save-button"
                        onClick={() => handleUpdateBooking(booking.userId, booking.id)}
                      >
                        Save
                      </button>
                      <button
                        className="booking-management-edit-cancel-button"
                        onClick={() => setEditingBookingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;