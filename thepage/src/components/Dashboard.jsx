import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  getTopics,
  getRandomChallenge,
  submitChallenge,
  getUser,
} from "../api/api";

const levelBadges = [
  { level: 1, name: "Code Novice", emoji: "👶" },
  { level: 3, name: "Logic Learner", emoji: "🧠" },
  { level: 5, name: "Syntax Samurai", emoji: "⚔️" },
  { level: 8, name: "Debug Master", emoji: "🪲" },
  { level: 10, name: "Code Guru", emoji: "🧙‍♂️" },
];

const avatars = ["🐣", "🐥", "🐓", "🦅", "🐉"];

const Dashboard = ({ user, onProfile }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [xp, setXp] = useState(user.xp || 0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(Math.floor((user.xp || 0) / 100));
  const [badges, setBadges] = useState(user.badges || []);
  const [showLevelModal, setShowLevelModal] = useState(false);

  // Fetch topics on load
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data.topics || data); // handle both structures
      } catch (err) {
        console.error("Error loading topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // ✅ Fetch random challenge with username
  const fetchChallenge = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setFeedback(null);
    setChallenge(null);
    setSelectedAnswer("");

    try {
      const data = await getRandomChallenge(user.username, selectedTopic);
      setChallenge(data);
    } catch (err) {
      console.error("Error fetching challenge:", err);
      setToast("No new challenges left for this topic! 🎯");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const playSound = (url) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play();
  };

  // ✅ Submit challenge + handle XP + badges
  const handleSubmit = async () => {
    if (!selectedAnswer) return alert("Please select an answer");

    try {
      const result = await submitChallenge({
        username: user.username,
        challenge_id: challenge.id,
        selected_answer: selectedAnswer,
      });
      setFeedback(result);

      if (result.correct) {
        const updatedUser = await getUser(user.username);
        const newXp = updatedUser.xp;

        if (newXp > xp) {
          setToast(`+${result.xp_earned} XP earned!`);
          setTimeout(() => setToast(null), 2500);
        }

        const newLevel = Math.floor(newXp / 100);
        if (newLevel > level) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          playSound("/sounds/levelup.mp3");
          setToast(`🎉 Level Up! You’re now Level ${newLevel}!`);
          setShowLevelModal(true);

          const unlocked = levelBadges.find((b) => b.level === newLevel);
          if (unlocked && !badges.includes(unlocked.name)) {
            setBadges((prev) => [...prev, unlocked.name]);
            setToast(`🏅 Unlocked: ${unlocked.emoji} ${unlocked.name}`);
          }
        }

        setXp(newXp);
        setLevel(newLevel);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...updatedUser, badges })
        );
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const handleNextChallenge = () => {
    fetchChallenge();
  };

  const currentAvatar =
    avatars[Math.min(Math.floor(xp / 100), avatars.length - 1)];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* 🔔 Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "1rem",
            animation: "fadeInOut 2.5s ease",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}

      {/* 🎉 Level-Up Modal */}
      {showLevelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setShowLevelModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
              maxWidth: "400px",
            }}
          >
            <h2>🎉 Level Up!</h2>
            <h3>You’ve reached Level {level}!</h3>
            <p>🔥 Keep going, {user.username}!</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Welcome, {user.username}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p style={{ margin: 0 }}>XP: {xp}</p>
          <button
            onClick={onProfile}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #000",
              color: "#000",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Profile
          </button>
        </div>
      </div>

      {/* 🐣 Avatar */}
      <div style={{ fontSize: "3rem", marginBottom: "10px" }}>
        {currentAvatar}
      </div>

      {/* 📈 XP Progress Bar */}
      <div style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}>
        <div
          style={{
            height: "15px",
            borderRadius: "10px",
            background: "#ddd",
          }}
        >
          <div
            style={{
              height: "15px",
              width: `${xp % 100}%`,
              background: "#000",
              borderRadius: "10px",
              transition: "width 0.5s ease",
            }}
          ></div>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          {xp % 100} / 100 XP to Level {level + 1}
        </p>
      </div>

      {/* Topic Selection */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #000",
            width: "200px",
            marginRight: "10px",
          }}
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={fetchChallenge}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Start Challenge"}
        </button>
      </div>

      {/* Challenge Display */}
      {challenge && (
        <div
          style={{
            maxWidth: "600px",
            border: "1px solid #000",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            {challenge.topic.toUpperCase()}
          </h3>
          <pre
            style={{
              backgroundColor: "#f8f8f8",
              padding: "15px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {challenge.question}
          </pre>

          <div style={{ marginTop: "20px" }}>
            {challenge.options.map((option, idx) => (
              <label
                key={idx}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  style={{ marginRight: "8px" }}
                />
                {option}
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>

          {feedback && (
            <div style={{ marginTop: "20px" }}>
              <p>
                {feedback.correct
                  ? `✅ Correct! +${feedback.xp_earned} XP`
                  : "❌ Incorrect."}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#333" }}>
                {feedback.explanation}
              </p>
              <button
                onClick={handleNextChallenge}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                Next Challenge
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
