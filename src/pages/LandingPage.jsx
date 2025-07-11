import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [openMenu, setOpenMenu] = useState("");
  const navRef = useRef(null);
  const scrollRef = useRef(null);

  // Close dropdown when clicking outside nav
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const navItems = ["netralink-pro", "explore"];

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <Navbar />

      {/* VIDEO HERO */}
      <section className="video-section">
        <video className="bg-video" autoPlay muted loop>
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay">
          <h1>Find Top Freelancers in Your Area</h1>
          <p>Connect. Collaborate. Create.</p>
          <div className="video-buttons">
            <Link to="/register" className="btn">
              JOIN NOW
            </Link>
            <Link to="/login" className="btn">
              SIGN IN
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN HEADING */}
      <h2 className="main-heading">Discover & Hire Top Freelancers Today</h2>

      {/* POPULAR SERVICES */}
      <div className="landing-wrapper">
        <h2 className="popular-heading">Popular Services</h2>
        <div className="scroll-container">
          <button className="scroll-btn left" onClick={() => scroll(-300)}>
            ❮
          </button>
          <div className="services-row" ref={scrollRef}>
            {[
              "web",
              "video",
              "software",
              "seo",
              "architecture",
              "book",
              "anime",
              "fashion",
              "marketing",
              "portraitart",
              "data",
            ].map((type) => {
              const titles = {
                web: "Web Development",
                video: "Video Editing",
                software: "Software Development",
                seo: "SEO",
                architecture: "Architecture & Interior Design",
                book: "Book Design",
                anime: "Animation Character Design",
                fashion: "Fashion Designing",
                marketing: "Marketing and Finance",
                portraitart: "Portrait Art Drawing",
                data: "Data Analytics",
              };
              return (
                <a
                  key={type}
                  href={`/services/${type}.html`}
                  className="service-card"
                >
                  <img src={`/${type}.jpg`} alt={titles[type]} />
                  <h4>{titles[type]}</h4>
                </a>
              );
            })}
          </div>
          <button className="scroll-btn right" onClick={() => scroll(300)}>
            ❯
          </button>
        </div>
      </div>

      {/* NETRALINK PRO SECTION */}
      <div className="netralink-pro-section" id="netralink-pro">
        <div className="pro-content">
          <h2>NetraLink-Pro</h2>
          <p>
            Get access to top-tier professional freelancers who are handpicked
            for their exceptional quality. Our Pro service ensures reliable,
            vetted talent for all your mission-critical projects.
          </p>
          <a href="#join-pro" className="pro-button">
            Join NetraLink-Pro
          </a>
        </div>
        <div className="pro-image">
          <img src="/pro.jpg" alt="NetraLink Pro" />
        </div>
      </div>

      {/* NETRALINK ENTERPRISE SECTION */}
      <div className="netralink-pro-section" id="netralink-enterprise">
        <div className="pro-content">
          <h2>NetraLink-Enterprise</h2>
          <p>
            Access tailored solutions and premium freelancers to scale your
            business faster. Our Enterprise service gives you dedicated support
            and resources.
          </p>
          <a href="#join-enterprise" className="pro-button">
            Join NetraLink-Enterprise
          </a>
        </div>
        <div className="pro-image">
          <img src="/enterprise.png" alt="NetraLink Enterprise" />
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="info-cards-section">
        {[
          {
            title: "Verified Freelancers",
            description:
              "Only trusted and verified professionals on the platform.",
          },
          {
            title: "Secure Payments",
            description:
              "Your payments are safe and released only upon approval.",
          },
          {
            title: "24/7 Support",
            description: "Our support team is always ready to help you.",
          },
          {
            title: "Custom Projects",
            description:
              "Post your project and get tailored proposals quickly.",
          },
        ].map((card, i) => (
          <div className="info-card" key={i}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {/* JOIN NOW BUTTON */}
      <div className="join-now-wrapper">
        <Link to="/register" className="join-now-button">
          Join Now
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="footer-cards">
          <div className="footer-card">
            <h4>Top Categories</h4>
            <ul>
              <li><a href="/services/web-development">Web Development</a></li>
              <li><a href="/services/seo">SEO Services</a></li>
              <li><a href="/services/graphic-design">Graphic Design</a></li>
            </ul>
          </div>
          <div className="footer-card">
            <h4>Explore</h4>
            <ul>
              <li><a href="/explore/freelancers">Freelancers</a></li>
              <li><a href="/explore/projects">Projects</a></li>
              <li><a href="/explore/agencies">Agencies</a></li>
            </ul>
          </div>
          <div className="footer-card">
            <h4>Support</h4>
            <ul>
              <li><a href="/help/contact">Contact Us</a></li>
              <li><a href="/help/faq">FAQs</a></li>
              <li><a href="/help/report">Report a Problem</a></li>
            </ul>
          </div>
          <div className="footer-card">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/partnership">Partnership</a></li>
              <li><a href="/invite">Invite Friends</a></li>
              <li><a href="/network">Create Network</a></li>
              <li><a href="/help">Help & Support</a></li>
            </ul>
          </div>
        </div>
        <div className="final-footer">
          <div className="footer-left">
            <img src="/logo.png" alt="NetraLink Logo" className="footer-logo" />
            <span className="footer-brand">NetraLink</span>
          </div>
          <div className="footer-right">
            {["facebook-f", "instagram", "linkedin-in", "twitter"].map((icon) => (
              <a
                key={icon}
                href={`https://www.${icon.includes("linkedin") ? "linkedin" : icon}.com`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`fab fa-${icon} social-icon`}></i>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}