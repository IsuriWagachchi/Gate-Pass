import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewRequest from "./pages/NewRequest";
import MyRequest from "./pages/MyRequest";
import UpdateRequest from "./pages/UpdateRequest";
import ItemTracker from "./pages/ItemTracker";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    console.log('Stored data:', { storedRole, storedUsername, token }); // Debug log


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

  // Protected Route wrapper component
  // eslint-disable-next-line react/prop-types
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        <Navbar 
          role={role} 
          username={username} 
          logout={handleLogout} 
          isAuthenticated={isAuthenticated}
        />
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="container mx-auto mt-10 text-center">
                  <h2 className="text-2xl font-bold">Welcome, {username || 'User'}!</h2>
                  <p className="mt-2">You are logged in as: {role}</p>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login 
                  setRole={setRole} 
                  setUsername={setUsername} 
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/new-request"
            element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-request"
            element={
              <ProtectedRoute>
                <MyRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item-tracker"
            element={
              <ProtectedRoute>
                <ItemTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-request/:id"
            element={
              <ProtectedRoute>
                <UpdateRequest />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;