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
  setDoc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [freelancers, setFreelancers] = useState([]);
  const [freelancersLoading, setFreelancersLoading] = useState(true);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectDeadline, setNewProjectDeadline] = useState("");
  const [postingProject, setPostingProject] = useState(false);

  const [projects, setProjects] = useState([
    {
      id: "dummy1",
      title: "Website Redesign",
      description: "Redesign the company website with a fresh, modern look.",
      budget: "1200",
      deadline: "2025-08-30",
    },
    {
      id: "dummy2",
      title: "Mobile App Development",
      description: "Develop a cross-platform mobile app for our services.",
      budget: "5000",
      deadline: "2025-09-15",
    },
  ]);

  const [proposals, setProposals] = useState([
    {
      id: "dummy1",
      projectTitle: "Website Redesign",
      proposalText: "I can deliver this project in 3 weeks.",
      bidAmount: "1100",
      timeframe: "21",
      status: "Pending",
    },
    {
      id: "dummy2",
      projectTitle: "Mobile App Development",
      proposalText: "Experienced in React Native, ready to start.",
      bidAmount: "4800",
      timeframe: "45",
      status: "Accepted",
    },
  ]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  // Load freelancers
  useEffect(() => {
    if (activeTab !== "browse") return;
    const fetchFreelancers = async () => {
      setFreelancersLoading(true);
      try {
        const q = query(collection(db, "users"), where("role", "==", "freelancer"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFreelancers(data);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
      } finally {
        setFreelancersLoading(false);
      }
    };
    fetchFreelancers();
  }, [activeTab]);

  // Load profile
  useEffect(() => {
    if (activeTab !== "profile") return;
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      setProfileLoading(true);
      try {
        const ref = doc(db, "users", auth.currentUser.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [activeTab]);

  const postProject = async () => {
    if (!newProjectTitle || !newProjectDescription || !newProjectBudget || !newProjectDeadline) {
      alert("Please fill all fields.");
      return;
    }
    try {
      setPostingProject(true);
      await addDoc(collection(db, "gigs"), {
        title: newProjectTitle,
        description: newProjectDescription,
        budget: newProjectBudget,
        deadline: newProjectDeadline,
        createdAt: serverTimestamp(),
        clientId: auth.currentUser ? auth.currentUser.uid : null,
        postedBy: "client",
      });
      alert("Project posted successfully!");
      setNewProjectTitle("");
      setNewProjectDescription("");
      setNewProjectBudget("");
      setNewProjectDeadline("");
      setActiveTab("projects");
    } catch (err) {
      console.error("Error posting project:", err);
      alert("Error posting project.");
    } finally {
      setPostingProject(false);
    }
  };

  const updateProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { displayName, bio },
        { merge: true }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-5" style={{ backgroundColor: "var(--beige)" }}>
        <div className="container">
          <h2 className="mb-4" style={{ color: "var(--maroon)" }}>
            Client Dashboard
          </h2>
          <ul className="nav nav-tabs mb-3">
            {[
              { key: "browse", label: "Browse Freelancers" },
              { key: "post", label: "Post New Project" },
              { key: "projects", label: "My Projects" },
              { key: "proposals", label: "Proposals Received" },
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
          <div>
            {activeTab === "browse" && (
              <div>
                {freelancersLoading ? (
                  <p>Loading freelancers...</p>
                ) : freelancers.length === 0 ? (
                  <p>No freelancers found.</p>
                ) : (
                  <div className="row">
                    {freelancers.map((f) => (
                      <div className="col-md-4 mb-3" key={f.id}>
                        <div className="card h-100">
                          <div className="card-body">
                            <h5>{f.displayName || "Unnamed Freelancer"}</h5>
                            <p>{f.bio || "No bio provided."}</p>
                            <button className="btn btn-primary btn-sm">View Profile</button>
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
                  Post a New Project
                </h5>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Budget</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newProjectDeadline}
                    onChange={(e) => setNewProjectDeadline(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={postProject}
                  disabled={postingProject}
                >
                  {postingProject ? "Posting..." : "Post Project"}
                </button>
              </div>
            )}
            {activeTab === "projects" && (
              <div>
                <ul className="list-group">
                  {projects.map((p) => (
                    <li className="list-group-item" key={p.id}>
                      <h5>{p.title}</h5>
                      <p>{p.description}</p>
                      <small>
                        Budget: ${p.budget} – Deadline: {p.deadline}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "proposals" && (
              <div>
                <ul className="list-group">
                  {proposals.map((pr) => (
                    <li className="list-group-item" key={pr.id}>
                      <h5>{pr.projectTitle}</h5>
                      <p>{pr.proposalText}</p>
                      <p>
                        Bid: ${pr.bidAmount} – Timeframe: {pr.timeframe} days
                      </p>
                      <small>Status: {pr.status}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="card p-4">
                {profileLoading ? (
                  <p>Loading profile...</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Display Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        value={email}
                        disabled
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={updateProfile}
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ClientDashboard;