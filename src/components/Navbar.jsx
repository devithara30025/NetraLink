import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Error logging out.");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "var(--maroon)" }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="NetraLink"
            width="40"
            className="me-2"
            style={{ borderRadius: "4px" }}
          />
          <span className="fw-bold text-beige">NetraLink</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-beige" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-beige" to="/gigs">
                Gigs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-beige" to="/chat">
                Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-beige" to="/about">
                About
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-2 align-items-center">
            {user ? (
              <>
                <span className="text-beige small">
                  Welcome, {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "var(--baby-pink)",
                    color: "var(--maroon)",
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "var(--baby-pink)",
                    color: "var(--maroon)",
                  }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "var(--dark-green)",
                    color: "#fff",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;