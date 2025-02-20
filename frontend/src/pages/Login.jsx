
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import slt from '../assets/slt.png';

const Login = ({ setRole, setUsername, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      console.log('Login response:', res.data); // Debug log

      // Make sure we're getting the username from the correct path in response
      const username = res.data.username;
      const role = res.data.role;

      if (!username) {
        console.error('Username not found in response:', res.data);
        throw new Error('Username not found in response');
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
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/4 translate-y-1/4"></div>
      
      {/* Card Container */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative">
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-8">
        <img 
  src={slt} 
  alt="SLT Logo" 
  className="w-50 h-50"
/>
          <h1 className="text-2xl font-semibold text-blue-900">SLT GATE PASS</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="SLT"
            >
              <option value="SLT">SLT</option>
                <option value="User">User</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">User Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter User Email"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-6"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:text-blue-600">
          Sign up
        </Link>
      </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  setRole: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;