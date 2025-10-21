import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Login failed");
        return;
      }

      const data = await res.json();
      alert(data.message);

      if (data.message === "Login successful") {
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.userId);

        if (data.role === "Customer") navigate("/customer-dashboard");
        else if (data.role === "Service Provider") navigate("/provider-dashboard");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label>Password</label>
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
};

export default Login;
