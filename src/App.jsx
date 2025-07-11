import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<ChatPage />} />

      {/* Client Dashboard */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Freelancer Dashboard */}
      <Route
        path="/freelancer/dashboard"
        element={
          <ProtectedRoute>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;