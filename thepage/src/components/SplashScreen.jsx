import React, { useEffect, useState } from "react";

const SplashScreen = ({ onStart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        transition: "opacity 1s ease-in-out",
        opacity: visible ? 1 : 0,
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "10px" }}>
        CodeSprint
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "30px" }}>
        Learn. Solve. Level Up.
      </p>
      <button
        onClick={onStart}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          padding: "12px 30px",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.8")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Start
      </button>
    </div>
  );
};

export default SplashScreen;
