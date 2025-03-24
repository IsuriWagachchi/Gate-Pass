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
import ViewExecutivePending from "./pages/ExecutivePending";

import VerifyPage from "./pages/VerifyPage";
import ViewVerify from "./pages/VerifyView";

import Dispatch from "./pages/Dispatch";
import ItemTrackerView from "./pages/ItemTrackerView";
import MyReceipt from "./pages/MyReceipt";
import DispatchView from "./pages/DispatchView";

import SenderDetails from "./pages/SenderDetails";

import ProfileCard from "./pages/ProfileCard";

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
          <Route path="/home" element={<ProtectedRoute Component={HomePage} allowedRoles={["user", "admin","executiveofficer","dutyofficer"]} />} />
          <Route path="/new-request" element={<ProtectedRoute Component={NewRequest} allowedRoles={["user", "admin","executiveofficer","dutyofficer"]} />} />
          <Route path="/my-request" element={<ProtectedRoute Component={MyRequest} allowedRoles={["user", "admin","executiveofficer","dutyofficer"]} />} />
          <Route path="/item-tracker" element={<ProtectedRoute Component={ItemTracker} allowedRoles={["user", "admin"]} />} />
          <Route path="/view-request/:id" element={<ProtectedRoute Component={ViewRequest} allowedRoles={["user", "admin","executiveofficer","dutyofficer"]} />} />
          <Route path="/update-request/:id" element={<ProtectedRoute Component={UpdateRequest} allowedRoles={["user", "admin","executiveofficer","dutyofficer"]} />} />
          <Route path="/executive-approve" element={<ProtectedRoute Component={ExecutiveApprovePage} allowedRoles={["admin","executiveofficer"]} />} />

          <Route path="/view-executive-pending/:id" element={<ProtectedRoute Component={ViewExecutivePending} allowedRoles={["admin","executiveofficer"]} />} />
          <Route path="/verify" element={<ProtectedRoute Component={VerifyPage} allowedRoles={["admin","dutyofficer"]} />} />
          <Route path="/view-verify/:id" element={<ProtectedRoute Component={ViewVerify} allowedRoles={["user", "admin","dutyofficer"]} />} />
          {/* <Route path="/view-executive-pending/:id" element={<ProtectedRoute Component={ViewExecutivePending} allowedRoles={["user", "admin"]} />} /> */}
          <Route path="/dispatch" element={<ProtectedRoute Component={Dispatch} allowedRoles={["user", "admin"]} />} />
          <Route path="/item-tracker-view/:id" element={<ProtectedRoute Component={ItemTrackerView} allowedRoles={["user", "admin"]} />} />
          <Route path="/my-receipt" element={<ProtectedRoute Component={MyReceipt} allowedRoles={["user", "admin"]} />} />
          <Route path="/dispatch-view/:id" element={<ProtectedRoute Component={DispatchView} allowedRoles={["user", "admin"]} />} />
          <Route path="/profile" element={<ProtectedRoute Component={ProfileCard} allowedRoles={["user", "admin"]} />} />



          {/* Admin-only route */}
          <Route path="/admin" element={<ProtectedRoute Component={AdminPage} allowedRoles={["admin"]} />} />
          <Route path="/home" element={<ProtectedRoute Component={AdminPage} allowedRoles={["admin"]} />} />

          

          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to ="/home" />
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
          <Route path="/" element={isAuthenticated ? <Navigate to={role === "admin" ? "/login" : "/home"} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
