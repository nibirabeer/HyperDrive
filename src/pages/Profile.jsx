import { useEffect, useState } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setUpdatedData(data);
          if (data.photoURL) {
            setPhotoURL(data.photoURL);
          }
        }
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setUpdatedData(userData);
    setError("");
    setMessage("");
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      setError("Please select a photo to upload.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, photoFile);
      const downloadURL = await getDownloadURL(storageRef);

      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      setPhotoURL(downloadURL);
      setUserData({ ...userData, photoURL: downloadURL });
      setMessage("Photo uploaded successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!updatedData.name || !updatedData.phone || !updatedData.license) {
      setError("All fields must be filled.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, updatedData);
      setUserData(updatedData);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please enter both current and new password.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed successfully.");
    } catch (error) {
      setError("Incorrect current password or other error.");
    }
  };

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container-unique">
      <h2 className="profile-title-unique">Profile Details</h2>
      {error && <p className="profile-error-unique">{error}</p>}
      {message && <p className="profile-success-unique">{message}</p>}

      <div className="profile-photo-section-unique">
        {photoURL && <img src={photoURL} alt="Profile" className="profile-photo-unique" />}
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="profile-photo-input-unique" />
        <button onClick={handlePhotoUpload} disabled={uploading} className="profile-button-unique">
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>

      <form className="profile-form-unique">
        <label className="profile-label-unique">Email:</label>
        <input type="text" value={userData.email} disabled className="profile-input-unique" />

        <label className="profile-label-unique">Name:</label>
        <input
          type="text"
          name="name"
          value={updatedData.name}
          onChange={handleChange}
          disabled={!editing}
          className="profile-input-unique"
        />

        <label className="profile-label-unique">License:</label>
        <input
          type="text"
          name="license"
          value={updatedData.license}
          onChange={handleChange}
          disabled={!editing}
          className="profile-input-unique"
        />

        <label className="profile-label-unique">Phone:</label>
        <input
          type="text"
          name="phone"
          value={updatedData.phone}
          onChange={handleChange}
          disabled={!editing}
          className="profile-input-unique"
        />

        {editing ? (
          <>
            <button type="button" onClick={handleSave} className="profile-button-unique">Save</button>
            <button type="button" onClick={handleCancel} className="profile-button-unique">Cancel</button>
          </>
        ) : (
          <button type="button" onClick={handleEdit} className="profile-button-unique">Edit</button>
        )}
      </form>

      <h2 className="profile-title-unique">Change Password</h2>
      <form className="profile-form-unique">
        <label className="profile-label-unique">Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="profile-input-unique"
        />

        <label className="profile-label-unique">New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="profile-input-unique"
        />

        <button type="button" onClick={handlePasswordChange} className="profile-button-unique">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;