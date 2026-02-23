import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:80");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [join, setJoin] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  const topics = [
    "General", "Sports", "Technology", "Movies", "Music",
    "Gaming", "Programming", "Fitness", "Travel", "Food"
  ];

  useEffect(() => {
    socket.on("messages", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("messages");
    };
  }, []);

  function joinroom() {
    if (!username || !room) return;
    socket.emit("join-room", { username, room });
    setJoin(true);
  }

  function sendMessage() {
    if (!currentMessage) return;
    socket.emit("send-message", { message: currentMessage, username, room });
    setCurrentMessage("");
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0a0a0f;
      color: #e8e6ff;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
    }

    .root {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      background-image:
        radial-gradient(ellipse 80% 50% at 20% 10%, rgba(120, 80, 255, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 90%, rgba(255, 80, 160, 0.08) 0%, transparent 60%);
      padding: 24px;
    }

    /* ---- JOIN SCREEN ---- */
    .join-card {
      width: 100%;
      max-width: 460px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 48px 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 0 80px rgba(120,80,255,0.08);
    }

    .join-eyebrow {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #7c5cff;
      margin-bottom: 12px;
    }

    .join-title {
      font-family: 'Syne', sans-serif;
      font-size: 36px;
      font-weight: 800;
      color: #f0eeff;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .join-subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.3);
      margin-bottom: 40px;
    }

    .field-label {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 8px;
    }

    .field-wrap {
      margin-bottom: 20px;
    }

    .styled-input, .styled-select {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 14px 16px;
      color: #e8e6ff;
      font-family: 'DM Mono', monospace;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      -webkit-appearance: none;
    }

    .styled-input::placeholder { color: rgba(255,255,255,0.2); }

    .styled-input:focus, .styled-select:focus {
      border-color: #7c5cff;
      background: rgba(124,92,255,0.07);
    }

    .styled-select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237c5cff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;
    }

    .styled-select option {
      background: #1a1625;
      color: #e8e6ff;
    }

    .join-btn {
      width: 100%;
      margin-top: 8px;
      padding: 15px;
      background: #7c5cff;
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
      box-shadow: 0 4px 24px rgba(124,92,255,0.3);
    }

    .join-btn:hover { background: #9070ff; box-shadow: 0 4px 32px rgba(124,92,255,0.5); }
    .join-btn:active { transform: scale(0.98); }

    /* ---- CHAT SCREEN ---- */
    .chat-wrap {
      width: 100%;
      max-width: 700px;
      height: 90vh;
      max-height: 760px;
      display: flex;
      flex-direction: column;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      overflow: hidden;
      backdrop-filter: blur(20px);
      box-shadow: 0 0 80px rgba(120,80,255,0.08);
    }

    .chat-header {
      padding: 20px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .room-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #7c5cff;
      box-shadow: 0 0 10px #7c5cff;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 10px #7c5cff; }
      50% { opacity: 0.6; box-shadow: 0 0 4px #7c5cff; }
    }

    .room-name {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #f0eeff;
    }

    .room-tag {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(124,92,255,0.3) transparent;
    }

    .messages-area::-webkit-scrollbar { width: 4px; }
    .messages-area::-webkit-scrollbar-track { background: transparent; }
    .messages-area::-webkit-scrollbar-thumb { background: rgba(124,92,255,0.3); border-radius: 4px; }

    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.15);
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .message-bubble {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      padding: 12px 16px;
      font-size: 14px;
      color: #d8d5f5;
      line-height: 1.5;
      max-width: 85%;
      word-break: break-word;
      animation: fadeUp 0.25s ease;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .input-area {
      padding: 16px 20px;
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .msg-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 13px 16px;
      color: #e8e6ff;
      font-family: 'DM Mono', monospace;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .msg-input::placeholder { color: rgba(255,255,255,0.2); }
    .msg-input:focus { border-color: #7c5cff; }

    .send-btn {
      width: 46px;
      height: 46px;
      background: #7c5cff;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 4px 16px rgba(124,92,255,0.35);
      flex-shrink: 0;
    }

    .send-btn:hover { background: #9070ff; }
    .send-btn:active { transform: scale(0.93); }

    .send-btn svg { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  `;

  if (!join) {
    return (
      <>
        <style>{styles}</style>
        <div className="root">
          <div className="join-card">
            <p className="join-eyebrow">Real-time chat</p>
            <h1 className="join-title">Join a Room</h1>
            <p className="join-subtitle">Pick a topic and start talking.</p>

            <div className="field-wrap">
              <p className="field-label">Username</p>
              <input
                className="styled-input"
                placeholder="Enter your name"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field-wrap">
              <p className="field-label">Topic</p>
              <select className="styled-select" onChange={(e) => setRoom(e.target.value)} defaultValue="">
                <option value="" disabled>Select a topic</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <button className="join-btn" onClick={joinroom}>Enter Room →</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="chat-wrap">
          <div className="chat-header">
            <div className="room-dot" />
            <div>
              <div className="room-name">{room}</div>
              <div className="room-tag">Live · {username}</div>
            </div>
          </div>

          <div className="messages-area">
            {messages.length === 0 && (
              <div className="empty-state">No messages yet</div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className="message-bubble">{msg}</div>
            ))}
          </div>

          <div className="input-area">
            <input
              className="msg-input"
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              <svg viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}