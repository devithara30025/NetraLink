import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load messages in real time
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage.trim(),
        senderId: auth.currentUser ? auth.currentUser.uid : "anonymous",
        senderName: auth.currentUser?.email || "Anonymous",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Could not send message.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-5" style={{ backgroundColor: "var(--beige)" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <h2 className="mb-4" style={{ color: "var(--maroon)" }}>
            Chat
          </h2>

          <div
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "1rem",
              height: "400px",
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "0.75rem",
                    textAlign:
                      msg.senderId === auth.currentUser?.uid ? "right" : "left",
                  }}
                >
                  <small style={{ fontWeight: "bold" }}>
                    {msg.senderName}
                  </small>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor:
                        msg.senderId === auth.currentUser?.uid
                          ? "var(--dark-green)"
                          : "var(--maroon)",
                      color: "#fff",
                      borderRadius: "15px",
                      padding: "0.5rem 0.75rem",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "var(--dark-green)", color: "#fff" }}
            >
              Send
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ChatPage;