import React, { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        role,
        createdAt: serverTimestamp(),
      });

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
          Create an Account
        </h3>

        {error && (
          <div className="alert alert-danger py-1">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label className="form-label">Role</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="client"
                  checked={role === "client"}
                  onChange={() => setRole("client")}
                />
                <label className="form-check-label">Client</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={role === "freelancer"}
                  onChange={() => setRole("freelancer")}
                />
                <label className="form-check-label">Freelancer</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "var(--dark-green)", color: "white" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;