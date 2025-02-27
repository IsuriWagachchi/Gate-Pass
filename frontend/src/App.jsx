import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewRequest from "./pages/NewRequest";
import MyRequest from "./pages/MyRequest";
import UpdateRequest from "./pages/UpdateRequest";
import ItemTracker from "./pages/ItemTracker";
import ViewRequest from "./pages/ViewRequest";
import ExecutiveApprovePage from "./pages/ExecutiveApprove";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

const App = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (token && storedRole && storedUsername) {
      setRole(storedRole);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ Component, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
    return <Component />;
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar role={role} username={username} logout={handleLogout} />}
        <Routes>
          {/* Routes accessible to all authenticated users */}
          <Route path="/home" element={<ProtectedRoute Component={HomePage} allowedRoles={["user", "admin"]} />} />
          <Route path="/new-request" element={<ProtectedRoute Component={NewRequest} allowedRoles={["user", "admin"]} />} />
          <Route path="/my-request" element={<ProtectedRoute Component={MyRequest} allowedRoles={["user", "admin"]} />} />
          <Route path="/item-tracker" element={<ProtectedRoute Component={ItemTracker} allowedRoles={["user", "admin"]} />} />
          <Route path="/view-request/:id" element={<ProtectedRoute Component={ViewRequest} allowedRoles={["user", "admin"]} />} />
          <Route path="/update-request/:id" element={<ProtectedRoute Component={UpdateRequest} allowedRoles={["user", "admin"]} />} />
          <Route path="/executive-approve" element={<ProtectedRoute Component={ExecutiveApprovePage} allowedRoles={["admin"]} />} />

          {/* Admin-only route */}
          <Route path="/admin" element={<ProtectedRoute Component={AdminPage} allowedRoles={["admin"]} />} />
          

          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={role === "admin" ? "/home" : "/admin"} />
              ) : (
                <Login setRole={setRole} setUsername={setUsername} setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

           {/* Signup Route */}
  <Route
    path="/signup"
    element={
      isAuthenticated ? (
        <Navigate to={role === "admin" ? "/home" : "/admin"} />
      ) : (
        <Signup setRole={setRole} setUsername={setUsername} setIsAuthenticated={setIsAuthenticated} />
      )
    }
  />


          {/* Home Redirect based on Role */}
          <Route path="/" element={isAuthenticated ? <Navigate to={role === "admin" ? "/admin" : "/new-request"} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
