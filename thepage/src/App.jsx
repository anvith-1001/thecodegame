import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);

  // 🧱 Load session from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setScreen("dashboard");
    }
  }, []);

  const handleStart = () => setScreen("login");

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // persist user
    setScreen("dashboard");
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user"); // clear session
    setScreen("splash");
  };

  // 🔒 Route protection
  if ((screen === "dashboard" || screen === "profile") && !user) {
    setScreen("login");
    return null;
  }

  if (screen === "splash") return <SplashScreen onStart={handleStart} />;
  if (screen === "login") return <Login onLogin={handleLogin} />;
  if (screen === "dashboard")
    return <Dashboard user={user} onProfile={() => setScreen("profile")} />;
  if (screen === "profile") return <Profile user={user} onSignOut={handleSignOut} />;

  return null;
}

export default App;
