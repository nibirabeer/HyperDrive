import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../styles/CarList.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const displayedCars = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((car) => car.display === true); // Filter cars with display field true
        setCars(displayedCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to fetch cars. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCardClick = (carId) => {
    navigate(`/login`); // Redirect to the car details page
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="car-list-container">
      <h1 className="car-list-title">Make Your Dream Come Reality!</h1>
      <div className="car-list">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div
              key={car.id}
              className="car-card"
              onClick={() => handleCardClick(car.id)} // Add onClick handler
              style={{ cursor: "pointer" }} // Change cursor to pointer on hover
            >
              <img className="car-image" src={car.photoURL} alt={car.name} />
              <div className="car-details">
                <h5 className="car-name">{car.name}</h5>
                <p className="car-price">Price: £{car.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-cars-message">No cars available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default CarList;