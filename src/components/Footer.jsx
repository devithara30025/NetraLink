import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer
      className="py-4 mt-auto"
      style={{ backgroundColor: "var(--maroon)", color: "var(--beige)" }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <img
            src={logo}
            alt="NetraLink"
            width="40"
            className="me-2"
            style={{ borderRadius: "4px" }}
          />
          <span className="fw-bold">NetraLink</span>
        </div>

        <ul className="nav mb-3 mb-md-0">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-beige">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/gigs" className="nav-link px-2 text-beige">
              Gigs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-beige">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link px-2 text-beige">
              Login
            </Link>
          </li>
        </ul>

        <span className="text-beige small">
          © {new Date().getFullYear()} NetraLink. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;