import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import ChatProvider from "./context/ChatContext";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ChatPage from "./chat/ChatPage";

function RequireAuth({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}