import React, { useState } from "react";
import { createUser } from "../api/api";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (guest = false) => {
    try {
      setLoading(true);
      setError("");
      const user = await createUser(username, guest);
      onLogin(user);
    } catch (err) {
      setError("Unable to login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        color: "#000",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Welcome to CodeSprint</h2>
      <p style={{ fontSize: "1rem", marginBottom: "40px" }}>
        Solve coding challenges and earn XP!
      </p>

      <div style={{ width: "300px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #000",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={() => handleLogin(false)}
          disabled={loading || !username.trim()}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            width: "100%",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p style={{ margin: "20px 0", fontSize: "0.9rem" }}>or</p>

      <button
        onClick={() => handleLogin(true)}
        disabled={loading}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer",
          width: "200px",
        }}
      >
        {loading ? "Loading..." : "Continue as Guest"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "20px", fontSize: "0.9rem" }}>{error}</p>
      )}
    </div>
  );
};

export default Login;
