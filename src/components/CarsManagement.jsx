import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/CarsManagement.css";

const CarsManagement = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ name: "", price: "", photo: null });
  const [updatedCar, setUpdatedCar] = useState({ name: "", price: "", photo: null, display: false });
  const [editingCarId, setEditingCarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [editCarModalOpen, setEditCarModalOpen] = useState(false);
  
  const storage = getStorage();
  
  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCars();
  }, []);
  
  const handleAddCar = async () => {
    if (!newCar.name || !newCar.price || !newCar.photo) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const storageRef = ref(storage, `cars/${newCar.photo.name}`);
      await uploadBytes(storageRef, newCar.photo);
      const photoURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "cars"), {
        name: newCar.name,
        price: newCar.price,
        photoURL,
        display: false, // Default display status
        createdAt: new Date(),
      });

      alert("Car added successfully!");
      setAddCarModalOpen(false);
      setNewCar({ name: "", price: "", photo: null });
      
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding car:", error);
      setError("Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateCar = async () => {
    if (!updatedCar.name || !updatedCar.price) {
      setError("All fields are required.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      let photoURL = updatedCar.photoURL;
      
      if (updatedCar.photo) {
        const storageRef = ref(storage, `cars/${updatedCar.photo.name}`);
        await uploadBytes(storageRef, updatedCar.photo);
        photoURL = await getDownloadURL(storageRef);
      }

      const carRef = doc(db, "cars", editingCarId);
      await updateDoc(carRef, {
        name: updatedCar.name,
        price: updatedCar.price,
        photoURL,
        display: updatedCar.display, // Save display status
      });

      alert("Car updated successfully!");
      setEditCarModalOpen(false);
      
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error updating car:", error);
      setError("Failed to update car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteDoc(doc(db, "cars", carId));
        setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
        alert("Car deleted successfully!");
      } catch (error) {
        console.error("Error deleting car:", error);
        setError("Failed to delete car. Please try again.");
      }
    }
  };
  
  return (
    <div className="cm-container">
      <h1 className="cm-title">Cars Management</h1>
      <button className="cm-add-car-button" onClick={() => setAddCarModalOpen(true)}>Add Car</button>

      {addCarModalOpen && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <h2>Add Car</h2>
            <input
              type="text"
              placeholder="Car Name"
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              className="cm-modal-input"
            />
            <input
              type="number"
              placeholder="Price"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
              className="cm-modal-input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCar({ ...newCar, photo: e.target.files[0] })}
              className="cm-modal-input"
            />
            <button className="cm-modal-button" onClick={handleAddCar} disabled={loading}>Add</button>
            <button className="cm-modal-button cm-cancel-button" onClick={() => setAddCarModalOpen(false)}>Cancel</button>
            {error && <p className="cm-error-message">{error}</p>}
          </div>
        </div>
      )}
      
      <div className="cm-cars-list">
        {cars.map(car => (
          <div key={car.id} className="cm-car-card">
            <img className="cm-car-image" src={car.photoURL} alt={car.name} />
            <div className="cm-car-details">
              <h5 className="cm-car-name">{car.name}</h5>
              <p className="cm-car-price">Price: £{car.price}</p>
              <div className="cm-car-actions">
                <button className="cm-edit-car-button" onClick={() => {
                  setEditingCarId(car.id);
                  setUpdatedCar({ name: car.name, price: car.price, photoURL: car.photoURL, display: car.display || false });
                  setEditCarModalOpen(true);
                }}>Edit</button>
                <button className="cm-remove-car-button" onClick={() => handleRemoveCar(car.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {editCarModalOpen && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <h2>Edit Car</h2>
            <input
              type="text"
              value={updatedCar.name}
              onChange={(e) => setUpdatedCar({ ...updatedCar, name: e.target.value })}
              className="cm-modal-input"
            />
            <input
              type="number"
              value={updatedCar.price}
              onChange={(e) => setUpdatedCar({ ...updatedCar, price: e.target.value })}
              className="cm-modal-input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUpdatedCar({ ...updatedCar, photo: e.target.files[0] })}
              className="cm-modal-input"
            />
            <label className="cm-display-checkbox">
              <input
                type="checkbox"
                checked={updatedCar.display}
                onChange={(e) => setUpdatedCar({ ...updatedCar, display: e.target.checked })}
              />
              Display Car
            </label>
            <button className="cm-modal-button" onClick={handleUpdateCar} disabled={loading}>Update</button>
            <button className="cm-modal-button cm-cancel-button" onClick={() => setEditCarModalOpen(false)}>Cancel</button>
            {error && <p className="cm-error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarsManagement;