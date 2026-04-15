import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AskAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AI health assistant. Describe your symptoms and I'll help identify potential conditions and recommend the right specialist for you.",
    },
  ]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ask-ai`, {
        message: input,
      });
      setMessages((prev) => [...prev, { type: "bot", text: res.data.reply }]);
      setDoctors(res.data.doctors || []);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          isError: true,
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "I have a headache and fever",
    "Chest pain and shortness of breath",
    "Skin rash and itching",
    "Back pain for 3 days",
  ];

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <BotIcon />
            </div>
            <span style={styles.logoText}>MediAI</span>
          </div>
        </div>

        <nav style={styles.nav}>
          <p style={styles.navLabel}>Quick symptoms</p>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              style={styles.navItem}
              onClick={() => {
                setInput(prompt);
                inputRef.current?.focus();
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {prompt}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.disclaimer}>
            <span style={styles.disclaimerDot} />
            <p style={styles.disclaimerText}>
              For informational use only. Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.topbar}>
          <div>
            <h1 style={styles.topbarTitle}>AI Health Assistant</h1>
            <p style={styles.topbarSubtitle}>Powered by advanced medical AI</p>
          </div>
          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            Online
          </div>
        </header>

        {/* Messages */}
        <div style={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.type === "bot" && (
                <div style={styles.avatar}>
                  <BotIcon />
                </div>
              )}
              <div
                style={{
                  ...styles.bubble,
                  ...(msg.type === "user" ? styles.userBubble : styles.botBubble),
                  ...(msg.isError ? styles.errorBubble : {}),
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
              <div style={styles.avatar}>
                <BotIcon />
              </div>
              <div style={styles.typingBubble}>
                <span style={styles.dot} />
                <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Describe your symptoms…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.textarea}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                ...styles.sendBtn,
                opacity: !input.trim() || loading ? 0.4 : 1,
                cursor: !input.trim() || loading ? "default" : "pointer",
              }}
            >
              <SendIcon />
            </button>
          </div>
          <p style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
        </div>
      </main>

      {/* Doctor Results Panel */}
      {doctors.length > 0 && (
        <aside style={styles.resultsPanel}>
          <div style={styles.resultsPanelHeader}>
            <h2 style={styles.resultsPanelTitle}>Recommended doctors</h2>
            <span style={styles.doctorCount}>{doctors.length} found</span>
          </div>

          <div style={styles.doctorList}>
            {doctors.map((doc) => (
              <div key={doc._id} style={styles.doctorCard}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")}
              >
                <div style={styles.doctorTop}>
                  <img src={doc.image} alt={doc.name} style={styles.doctorImg} />
                  <div style={styles.doctorInfo}>
                    <h3 style={styles.doctorName}>{doc.name}</h3>
                    <span style={styles.specialityTag}>{doc.speciality}</span>
                  </div>
                </div>

                <div style={styles.doctorMeta}>
                  <span style={styles.metaItem}>{doc.experience}</span>
                </div>

                <div style={styles.doctorFooter}>
                  <div style={styles.feeBlock}>
                    <span style={styles.feeLabel}>Consultation fee</span>
                    <span style={styles.feeAmount}>₹{doc.fees}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/appointment/${doc._id}`)}
                    style={styles.bookBtn}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
                  >
                    <CalendarIcon />
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1); }
        }
        textarea:focus { outline: none; }
        textarea { resize: none; font-family: inherit; }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "#f8f8fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1a1a2e",
    overflow: "hidden",
  },

  /* Sidebar */
  sidebar: {
    width: 240,
    minWidth: 240,
    background: "#fff",
    borderRight: "1px solid rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  sidebarHeader: { padding: "0 20px 24px" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 34, height: 34, borderRadius: 10,
    background: "#6366f1", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 17, fontWeight: 600, color: "#1a1a2e" },
  nav: { flex: 1, padding: "0 12px" },
  navLabel: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
    textTransform: "uppercase", color: "#9ca3af",
    margin: "0 8px 8px", padding: 0,
  },
  navItem: {
    width: "100%", textAlign: "left", background: "transparent",
    border: "none", borderRadius: 8, padding: "9px 12px",
    fontSize: 13, color: "#4b5563", cursor: "pointer",
    transition: "background 0.15s", display: "block", marginBottom: 2,
  },
  sidebarFooter: { padding: "0 16px" },
  disclaimer: {
    display: "flex", gap: 8, alignItems: "flex-start",
    background: "#fef3c7", borderRadius: 8, padding: "10px 12px",
  },
  disclaimerDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#f59e0b", flexShrink: 0, marginTop: 4,
  },
  disclaimerText: { fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.5 },

  /* Main */
  main: {
    flex: 1, display: "flex", flexDirection: "column", minWidth: 0,
  },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 28px", background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  },
  topbarTitle: { fontSize: 17, fontWeight: 600, margin: 0, color: "#1a1a2e" },
  topbarSubtitle: { fontSize: 12, color: "#9ca3af", margin: "2px 0 0" },
  statusBadge: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, color: "#059669", fontWeight: 500,
    background: "#ecfdf5", borderRadius: 20, padding: "4px 12px",
  },
  statusDot: {
    width: 6, height: 6, borderRadius: "50%", background: "#10b981",
  },

  /* Chat */
  chatArea: {
    flex: 1, overflowY: "auto", padding: "28px 28px 12px",
    display: "flex", flexDirection: "column", gap: 16,
  },
  messageRow: { display: "flex", alignItems: "flex-end", gap: 10 },
  avatar: {
    width: 32, height: 32, borderRadius: 10,
    background: "#ede9fe", color: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "68%", padding: "12px 16px",
    borderRadius: 16, fontSize: 14, lineHeight: 1.6,
  },
  userBubble: {
    background: "#6366f1", color: "#fff",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    background: "#fff", color: "#1a1a2e",
    border: "1px solid rgba(0,0,0,0.07)",
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
  },
  typingBubble: {
    background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 16, borderBottomLeftRadius: 4,
    padding: "14px 18px", display: "flex", gap: 5, alignItems: "center",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%", background: "#c4b5fd",
    display: "inline-block",
    animation: "blink 1.2s infinite ease-in-out",
  },

  /* Input */
  inputArea: {
    padding: "16px 28px 20px",
    background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)",
  },
  inputWrapper: {
    display: "flex", alignItems: "flex-end", gap: 10,
    background: "#f8f8fc", border: "1.5px solid rgba(99,102,241,0.25)",
    borderRadius: 14, padding: "10px 12px",
    transition: "border-color 0.15s",
  },
  textarea: {
    flex: 1, background: "transparent", border: "none",
    fontSize: 14, lineHeight: 1.6, color: "#1a1a2e",
    maxHeight: 120, overflowY: "auto",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sendBtn: {
    width: 34, height: 34, borderRadius: 9, border: "none",
    background: "#6366f1", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "background 0.15s, opacity 0.15s",
  },
  inputHint: {
    fontSize: 11, color: "#d1d5db", margin: "6px 0 0", textAlign: "center",
  },

  /* Results Panel */
  resultsPanel: {
    width: 300, minWidth: 300, background: "#fff",
    borderLeft: "1px solid rgba(0,0,0,0.07)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  resultsPanelHeader: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  resultsPanelTitle: { fontSize: 15, fontWeight: 600, margin: 0 },
  doctorCount: {
    fontSize: 12, background: "#ede9fe", color: "#6366f1",
    borderRadius: 20, padding: "3px 10px", fontWeight: 500,
  },
  doctorList: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 },

  /* Doctor Card */
  doctorCard: {
    background: "#fff", border: "1.5px solid rgba(0,0,0,0.08)",
    borderRadius: 14, padding: 16, transition: "border-color 0.2s",
  },
  doctorTop: { display: "flex", gap: 12, marginBottom: 10 },
  doctorImg: {
    width: 48, height: 48, borderRadius: 12, objectFit: "cover",
    border: "2px solid #ede9fe",
  },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: "#1a1a2e" },
  specialityTag: {
    fontSize: 11, background: "#ede9fe", color: "#6366f1",
    borderRadius: 6, padding: "2px 8px", fontWeight: 500,
  },
  doctorMeta: { marginBottom: 12 },
  metaItem: { fontSize: 12, color: "#6b7280" },
  doctorFooter: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12,
  },
  feeBlock: { display: "flex", flexDirection: "column", gap: 1 },
  feeLabel: { fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" },
  feeAmount: { fontSize: 16, fontWeight: 600, color: "#1a1a2e" },
  bookBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#6366f1", color: "#fff", border: "none",
    borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "background 0.15s",
  },
};

export default AskAI;