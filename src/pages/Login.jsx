import React, { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role || "client";

      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "var(--maroon)" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%", backgroundColor: "var(--beige)" }}>
        <div className="text-center mb-3">
          <img src={logo} alt="NetraLink Logo" width="80" />
        </div>
        <h3 className="text-center mb-3" style={{ color: "var(--maroon)" }}>
          Login to NetraLink
        </h3>

        {error && (
          <div className="alert alert-danger py-1">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "var(--dark-green)", color: "white" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;