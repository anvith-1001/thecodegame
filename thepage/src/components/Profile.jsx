import React, { useEffect, useState } from "react";
import { getUser } from "../api/api";

const Profile = ({ user, onSignOut }) => {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const freshUser = await getUser(user.username);
        setProfile(freshUser);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.username]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}
      >
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Profile</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        <strong>Username:</strong> {profile.username}
      </p>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        <strong>XP:</strong> {profile.xp}
      </p>

      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "left",
          borderTop: "1px solid #000",
          marginTop: "20px",
          paddingTop: "10px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Completed Challenges:</h3>
        {profile.completed_questions && profile.completed_questions.length > 0 ? (
          <ul style={{ lineHeight: "1.8" }}>
            {profile.completed_questions.map((id) => (
              <li key={id} style={{ fontSize: "0.95rem" }}>
                {id}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "#555" }}>No challenges yet.</p>
        )}
      </div>

      <button
        onClick={onSignOut}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer",
          marginTop: "40px",
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
