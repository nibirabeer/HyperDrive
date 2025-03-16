import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/Login.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    license: "",
    email: localStorage.getItem("rememberedEmail") || "",
    password: localStorage.getItem("rememberedPassword") || "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedEmail") && !!localStorage.getItem("rememberedPassword")
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        navigate("/"); // Redirect to home page when logged in
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [setIsLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const validateForm = () => {
    const { email, password, firstName, lastName, phone, license } = formData;
    if (!email || !password) return setError("Email and password are required."), false;
    if (!isLogin && (!firstName || !lastName || !phone || !license))
      return setError("All fields are required for sign-up."), false;
    if (password.length < 6) return setError("Password must be at least 6 characters long."), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const { email, password, firstName, lastName, phone, license } = formData;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = {
          uid: userCredential.user.uid,
          name: `${firstName} ${lastName}`,
          phone,
          license,
          email,
        };
        await setDoc(doc(db, "users", newUser.uid), newUser);
      }
      setIsLoggedIn(true);
      navigate("/"); // Redirect after login/signup
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setError("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract user details from Google
      const userData = {
        uid: user.uid,
        name: user.displayName, // Fetch name from Google
        email: user.email, // Fetch email from Google
        phone: "", // Optional: Can be updated later
        license: "", // Optional: Can be updated later
      };

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      setIsLoggedIn(true);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container-unique">
      <h1 className="login-heading-unique">Grab Yours ASAP!</h1>

      <div className="login-card-unique">
        <h2 className="login-heading-unique">{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="login-error-unique">{error}</p>}
        <form className="login-form-unique" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="license"
                placeholder="Driving License No."
                value={formData.license}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <div className="login-checkbox-unique">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          <button type="submit" disabled={loading} className="login-submit-unique">
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Google Login Button */}
        <button onClick={handleGoogleLogin} className="google-login-button-unique">
          Sign in with Google
        </button>

        <p className="login-toggle-unique">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            className="login-toggle-button-unique"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {isLogin && (
          <p className="login-forgot-password-unique">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="login-forgot-button-unique"
            >
              Forgot Password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;