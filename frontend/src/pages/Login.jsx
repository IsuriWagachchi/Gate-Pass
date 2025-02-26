import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import slt from "../assets/slt.png";

const Login = ({ setRole, setUsername, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      console.log("Login response:", res.data); // Debug log
      const username = res.data.username;
      const role = res.data.role;
      if (!username) {
        console.error("Username not found in response:", res.data);
        throw new Error("Username not found in response");
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      setRole(role);
      setUsername(res.data.username);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      {/* Background shapes */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/4 -translate-y-1/4"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 0.5, scale: 1 }} 
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/4 translate-y-1/4"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 0.5, scale: 1 }} 
        transition={{ duration: 1 }}
      />

      {/* Card Container */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-8">
          <img src={slt} alt="SLT Logo" className="w-50 h-50" />
          <h1 className="text-2xl font-semibold text-blue-900">SLT GATE PASS</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Dropdown */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="SLT"
            >
              <option value="SLT">SLT</option>
              <option value="User">User</option>
            </select>
          </motion.div>

          {/* Email Input */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700">User Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter User Email"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Password"
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  setRole: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
