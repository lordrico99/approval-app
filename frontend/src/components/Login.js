// src/components/Login.js
import React, { useState } from "react";
import users from "../users"; // adjust path as needed

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
    } else {
      setError("Email not recognized.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
