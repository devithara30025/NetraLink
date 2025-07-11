import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gig1 from "../assets/gig/gig1.jpg";
import gig2 from "../assets/gig/gig2.jpg";
import gig3 from "../assets/gig/gig3.jpg";

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [newGigTitle, setNewGigTitle] = useState("");
  const [newGigDescription, setNewGigDescription] = useState("");
  const [newGigCategory, setNewGigCategory] = useState("");
  const [newGigImage, setNewGigImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [gigsLoading, setGigsLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(true);

  const categories = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Mobile Apps",
    "Video Editing",
  ];

  const gigImages = [gig1, gig2, gig3];

  // Load gigs
  useEffect(() => {
    const fetchGigs = async () => {
      setGigsLoading(true);
      try {
        const q = query(collection(db, "gigs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const gigsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGigs(gigsData);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setGigsLoading(false);
      }
    };

    fetchGigs();
  }, [activeTab]);

  // Load proposals
  useEffect(() => {
    if (activeTab !== "proposals") return;
    const fetchProposals = async () => {
      if (!auth.currentUser) return;
      setProposalsLoading(true);
      try {
        const q = query(
          collection(db, "proposals"),
          where("freelancerId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const proposalsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            // Get gig title
            let gigTitle = "Unknown Gig";
            try {
              const gigDoc = await getDoc(doc(db, "gigs", data.gigId));
              if (gigDoc.exists()) {
                gigTitle = gigDoc.data().title;
              }
            } catch (err) {
              console.error("Error fetching gig:", err);
            }
            return { id: docSnap.id, ...data, gigTitle };
          })
        );

        setProposals(proposalsData);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setProposalsLoading(false);
      }
    };
    fetchProposals();
  }, [activeTab]);

  const handlePostGig = async (e) => {
    e.preventDefault();

    if (!newGigTitle || !newGigDescription || !newGigCategory || !newGigImage) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      setLoading(true);

      // Convert image to Base64
      const base64 = await toBase64(newGigImage);

      // Save gig metadata
      const docRef = await addDoc(collection(db, "gigs"), {
        title: newGigTitle,
        description: newGigDescription,
        category: newGigCategory,
        createdAt: serverTimestamp(),
        freelancerId: auth.currentUser ? auth.currentUser.uid : null,
      });

      // Store Base64 in localStorage
      localStorage.setItem(`gigImage_${docRef.id}`, base64);

      alert("Gig posted successfully!");

      // Reset form
      setNewGigTitle("");
      setNewGigDescription("");
      setNewGigCategory("");
      setNewGigImage(null);
      setImagePreview(null);

      // Refresh gigs
      setActiveTab("browse");
    } catch (error) {
      console.error("Error posting gig:", error);
      alert("Error posting gig. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewGigImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <Navbar />

      <section className="py-5" style={{ backgroundColor: "var(--beige)" }}>
        <div className="container">
          <h2 className="mb-4" style={{ color: "var(--maroon)" }}>
            Freelancer Dashboard
          </h2>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            {[
              { key: "browse", label: "Browse Gigs" },
              { key: "post", label: "Post New Gig" },
              { key: "proposals", label: "My Proposals" },
              { key: "projects", label: "Ongoing Projects" },
              { key: "messages", label: "Messages" },
              { key: "profile", label: "Profile & Settings" },
            ].map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div>
            {activeTab === "browse" && (
              <div>
                {gigsLoading ? (
                  <p>Loading gigs...</p>
                ) : gigs.length === 0 ? (
                  <p>No gigs found.</p>
                ) : (
                  <div className="row">
                    {gigs.map((gig) => (
                      <div className="col-md-4 mb-3" key={gig.id}>
                        <div className="card h-100">
                          <img
                            src={
                              localStorage.getItem(`gigImage_${gig.id}`) ||
                              gigImages[Math.floor(Math.random() * gigImages.length)]
                            }
                            className="card-img-top"
                            alt={gig.title}
                            style={{ objectFit: "cover", height: "180px" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{gig.title}</h5>
                            <p className="card-text">{gig.description}</p>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "var(--dark-green)",
                                color: "#fff",
                              }}
                            >
                              Submit Proposal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "post" && (
              <div className="card p-4">
                <h5 className="mb-3" style={{ color: "var(--maroon)" }}>
                  Post a New Gig
                </h5>
                <form onSubmit={handlePostGig}>
                  <div className="mb-3">
                    <label className="form-label">Gig Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newGigTitle}
                      onChange={(e) => setNewGigTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newGigDescription}
                      onChange={(e) => setNewGigDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newGigCategory}
                      onChange={(e) => setNewGigCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  {imagePreview && (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "var(--dark-green)",
                      color: "#fff",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Posting..." : "Post Gig"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "proposals" && (
              <div>
                {proposalsLoading ? (
                  <p>Loading proposals...</p>
                ) : proposals.length === 0 ? (
                  <p>You have not submitted any proposals yet.</p>
                ) : (
                  <ul className="list-group">
                    {proposals.map((p) => (
                      <li className="list-group-item" key={p.id}>
                        <h5>{p.gigTitle || "Untitled Gig"}</h5>
                        <p>{p.proposalText}</p>
                        <p>
                          Bid: ${p.bidAmount} – Timeframe: {p.timeframe} days
                        </p>
                        <div className="mb-2">
                          {p.status === "Accepted" && (
                            <span className="badge bg-success">Accepted</span>
                          )}
                          {p.status === "Rejected" && (
                            <span className="badge bg-danger">Rejected</span>
                          )}
                          {(!p.status || p.status === "Pending") && (
                            <span className="badge bg-secondary">Pending</span>
                          )}
                        </div>
                        <small>
                          Submitted on{" "}
                          {p.createdAt?.toDate
                            ? p.createdAt.toDate().toLocaleString()
                            : "N/A"}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <p>You have no ongoing projects.</p>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <p>Your message inbox will appear here.</p>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <p>Profile editing and settings will go here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;