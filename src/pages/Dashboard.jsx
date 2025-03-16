import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [rentalTime, setRentalTime] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Fetch available cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollectionRef = collection(db, "cars");
        const carSnapshot = await getDocs(carsCollectionRef);
        const carList = carSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carList);
      } catch (error) {
        console.error("Error fetching cars: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Handle booking submission
  const handleBookNow = async () => {
    if (!selectedCar || !rentalDate || !rentalTime || !rentalDuration) {
      alert("Please fill out all fields and select a car.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to book a car.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const bookingData = {
        carId: selectedCar.id,
        carName: selectedCar.name,
        carPhotoURL: selectedCar.photoURL, // Save the car's photo URL
        rentalDate,
        rentalTime,
        rentalDuration,
        totalPrice: selectedCar.price * rentalDuration,
      };

      await addDoc(collection(userDocRef, "bookings"), bookingData);

      alert(
        `Booking confirmed for ${selectedCar.name} on ${rentalDate} at ${rentalTime} for ${rentalDuration} hours.`
      );

      setSelectedCar(null);
      setRentalDate("");
      setRentalTime("");
      setRentalDuration("");
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading cars...</p>;
  }

  return (
    <div className="dashboard">
      <h1>Rent a Supercar</h1>
      <div className="car-list-container">
        <div className="car-list">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`car-card ${selectedCar?.id === car.id ? "selected" : ""}`}
              onClick={() => setSelectedCar(car)}
            >
              <img src={car.photoURL} alt={car.name} className="car-image" />
              <h2>{car.name}</h2>
              <p>Price: £{car.price}/hour</p>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-form">
        <label>
          Rental Date:
          <input
            type="date"
            value={rentalDate}
            onChange={(e) => setRentalDate(e.target.value)}
            required
          />
        </label>
        <label>
          Rental Time:
          <input
            type="time"
            value={rentalTime}
            onChange={(e) => setRentalTime(e.target.value)}
            required
          />
        </label>
        <label>
          Rental Duration (hours):
          <input
            type="number"
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
            placeholder="Enter duration in hours"
            min="1"
            required
          />
        </label>
        <button onClick={handleBookNow}>Book Now</button>
      </div>

      {selectedCar && (
        <div className="selected-car-details">
          <h2>Selected Car: {selectedCar.name}</h2>
          <img src={selectedCar.photoURL} alt={selectedCar.name} className="selected-car-image" />
          <p>Price: £{selectedCar.price}/hour</p>
          <p>Total Price: £{selectedCar.price * rentalDuration}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;