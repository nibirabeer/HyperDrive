// UserManagement.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../services/firebase"; // Adjust the path as necessary
import "../styles/UserManagement.css";
const UserManagement = () => {
  const [users, setUsers] = useState([]); // State to store all users' data
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  const [editingUserId, setEditingUserId] = useState(null); // State to track which user is being edited
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false); // State for add user modal
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false); // State for edit user modal
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    phone: "",
    license: "",
    role: "",
    photoURL: "",
  }); // State for updated user data
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    license: "",
    role: "user",
    photoURL: "",
  });
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading state
  const [filter, setFilter] = useState("all"); // State to manage filter (all, admin, user)

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize filtered users with all users
        console.log("Users fetched successfully:", usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  // Handle updating user data
  const handleUpdateUser = async () => {
    if (!updatedUser.name || !updatedUser.email || !updatedUser.phone || !updatedUser.license) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userRef = doc(db, "users", editingUserId);
      await updateDoc(userRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        license: updatedUser.license,
        role: updatedUser.role,
        photoURL: updatedUser.photoURL,
      });
      alert("User updated successfully!");

      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      applyFilter(filter, usersData); // Reapply filter after update

      setEditUserModalOpen(false); // Close edit modal
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.license) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "users"), {
        ...newUser,
        createdAt: new Date(),
      });
      alert("User added successfully!");

      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      applyFilter(filter, usersData); // Reapply filter after adding a new user

      setAddUserModalOpen(false); // Close add user modal
      setNewUser({
        name: "",
        email: "",
        phone: "",
        license: "",
        role: "user",
        photoURL: "",
      }); // Reset form
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully!");

        // Refresh user list
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        applyFilter(filter, usersData); // Reapply filter after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  // Handle toggling admin role
  const handleToggleAdmin = async () => {
    try {
      const userRef = doc(db, "users", editingUserId);
      const newRole = updatedUser.role === "admin" ? "user" : "admin"; // Toggle role
      await updateDoc(userRef, {
        role: newRole,
      });
      alert(`User role updated to ${newRole} successfully!`);

      // Refresh user list
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      applyFilter(filter, usersData); // Reapply filter after role change

      // Update the local state for the updated user
      setUpdatedUser((prev) => ({ ...prev, role: newRole }));
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. Please try again.");
    }
  };

  // Apply filter based on selected option
  const applyFilter = (filterType, usersList) => {
    if (filterType === "admin") {
      setFilteredUsers(usersList.filter((user) => user.role === "admin"));
    } else if (filterType === "user") {
      setFilteredUsers(usersList.filter((user) => user.role === "user"));
    } else {
      setFilteredUsers(usersList); // Show all users
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    applyFilter(selectedFilter, users);
  };

  return (
    <div className="user-management">
      <h1 className="admin-panel-heading">USER MANAGEMENT</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="header-buttons">
        <button className="add-user-button" onClick={() => setAddUserModalOpen(true)}>
          Add New User
        </button>
        <select className="filter-dropdown" value={filter} onChange={handleFilterChange}>
          <option value="all">Show All</option>
          <option value="admin">Show Admins</option>
          <option value="user">Show Users</option>
        </select>
      </div>

      <div className="user-list-scrollable">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`user-card ${user.role === "admin" ? "admin-card" : "user-card"}`}
          >
            <div className="user-image">
              <img src={user.photoURL || "/default-user.png"} alt={user.name} />
            </div>
            <div className="user-details">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-phone">{user.phone}</p>
              <p className="user-license">{user.license}</p>
              <div className="user-role">
                <span
                  className={`role-badge ${
                    user.role === "admin" ? "admin-badge" : "user-badge"
                  }`}
                >
                  {user.role || "user"}
                </span>
              </div>
            </div>
            <div className="user-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingUserId(user.id);
                  setUpdatedUser({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    license: user.license,
                    role: user.role,
                    photoURL: user.photoURL,
                  });
                  setEditUserModalOpen(true);
                }}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteUser(user.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New User</h2>
            <form>
              <label>Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Name"
              />
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
              />
              <label>Phone</label>
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Phone"
              />
              <label>License</label>
              <input
                type="text"
                value={newUser.license}
                onChange={(e) => setNewUser({ ...newUser, license: e.target.value })}
                placeholder="License"
              />
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <label>Profile Picture URL</label>
              <input
                type="text"
                value={newUser.photoURL}
                onChange={(e) => setNewUser({ ...newUser, photoURL: e.target.value })}
                placeholder="Profile Picture URL"
              />
              <div className="modal-buttons">
                <button type="button" onClick={handleAddUser} disabled={loading}>
                  {loading ? "Adding..." : "Add User"}
                </button>
                <button type="button" onClick={() => setAddUserModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            <form>
              <label>Name</label>
              <input
                type="text"
                value={updatedUser.name}
                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                placeholder="Name"
              />
              <label>Email</label>
              <input
                type="email"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                placeholder="Email"
              />
              <label>Phone</label>
              <input
                type="text"
                value={updatedUser.phone}
                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                placeholder="Phone"
              />
              <label>License</label>
              <input
                type="text"
                value={updatedUser.license}
                onChange={(e) => setUpdatedUser({ ...updatedUser, license: e.target.value })}
                placeholder="License"
              />
              <label>Role</label>
              <select
                value={updatedUser.role}
                onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <label>Profile Picture URL</label>
              <input
                type="text"
                value={updatedUser.photoURL}
                onChange={(e) => setUpdatedUser({ ...updatedUser, photoURL: e.target.value })}
                placeholder="Profile Picture URL"
              />
              <div className="modal-buttons">
                <button type="button" onClick={handleUpdateUser} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleAdmin}
                  disabled={loading}
                >
                  {updatedUser.role === "admin" ? "Remove Admin" : "Assign Admin"}
                </button>
                <button type="button" onClick={() => setEditUserModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;