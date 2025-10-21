import React, { useState } from "react";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    if (!role) {
      return alert("Please select a role");
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label>Select Role</label>
        <div className="role-buttons">
          <button
            type="button"
            className={role === "Service Provider" ? "selected" : ""}
            onClick={() => setRole("Service Provider")}
          >
            Service Provider
          </button>
          <button
            type="button"
            className={role === "Customer" ? "selected" : ""}
            onClick={() => setRole("Customer")}
          >
            Customer
          </button>
        </div>

        <button type="submit" className="signup-btn">
          Sign up
        </button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
