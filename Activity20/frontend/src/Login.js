import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Authentication = ({
  username,
  setUsername,
  password,
  setPassword,
  setUserRole,
}) => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after login

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/contact/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Invalid username or password.");
        return;
      }

      const { role } = await response.json(); // Assume response contains { role: "admin" or "user" }
      setUserRole(role); // Set the user role (admin/user)
      setError(""); // Clear any previous error
      navigate("/"); // Redirect to the home page
    } catch (err) {
      console.error("Login failed:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Authentication;
