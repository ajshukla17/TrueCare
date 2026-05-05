import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PulseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DoctorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const quickPrompts = [
  { label: "Headache & fever", text: "I have a headache and fever" },
  { label: "Chest pain", text: "Chest pain and shortness of breath" },
  { label: "Skin rash & itching", text: "Skin rash and itching" },
  { label: "Back pain", text: "Back pain for 3 days" },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorsOpen, setDoctorsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close panels on outside click (mobile)
  useEffect(() => {
    const handler = (e) => {
      if (sidebarOpen && !e.target.closest(".sidebar") && !e.target.closest(".sidebar-toggle")) {
        setSidebarOpen(false);
      }
      if (doctorsOpen && !e.target.closest(".results-panel") && !e.target.closest(".doctors-toggle")) {
        setDoctorsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen, doctorsOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/ask-ai`, { message: input });
      setMessages((prev) => [...prev, { type: "bot", text: res.data.reply }]);
      setDoctors(res.data.doctors || []);
      if (res.data.doctors?.length > 0) setDoctorsOpen(true);
    } catch {
      setMessages((prev) => [...prev, { type: "bot", text: "I'm having trouble connecting right now. Please try again in a moment.", isError: true }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ═══════════════════════════════
           THEME TOKENS
        ═══════════════════════════════ */
        :root, [data-theme="light"], .light {
          --bg-page:          #f4f4fb;
          --bg-sidebar:       #ffffff;
          --bg-main:          #f8f8fc;
          --bg-topbar:        rgba(255,255,255,0.95);
          --bg-input-area:    rgba(255,255,255,0.95);
          --bg-bubble-bot:    #ffffff;
          --bg-bubble-err:    #fef2f2;
          --bg-card:          #ffffff;
          --bg-card-hover:    #f5f4ff;
          --bg-input:         #f4f4fb;
          --bg-typing:        #ffffff;
          --bg-disclaimer:    rgba(234,179,8,0.07);
          --bg-avatar:        rgba(99,102,241,0.08);
          --bg-nav-hover:     rgba(99,102,241,0.06);
          --bg-results:       #ffffff;
          --border-main:      rgba(0,0,0,0.07);
          --border-card:      rgba(0,0,0,0.07);
          --border-input:     rgba(0,0,0,0.1);
          --border-focus:     rgba(99,102,241,0.4);
          --border-avatar:    rgba(99,102,241,0.18);
          --border-doc-img:   rgba(99,102,241,0.25);
          --border-nav-hover: rgba(99,102,241,0.18);
          --text-primary:     #1a1a2e;
          --text-secondary:   #6b7280;
          --text-muted:       #9ca3af;
          --text-faint:       #c4c4d4;
          --text-placeholder: #c4c4d4;
          --text-bubble-bot:  #1a1a2e;
          --text-bubble-err:  #991b1b;
          --text-nav:         #6b7280;
          --text-logo:        #1a1a2e;
          --text-disclaimer:  #92400e;
          --text-fee-label:   #9ca3af;
          --text-hint:        #d1d5db;
          --text-dot:         #c4b5fd;
          --accent-text:      #6366f1;
          --accent-light:     rgba(99,102,241,0.08);
          --accent-border:    rgba(99,102,241,0.2);
          --badge-bg:         rgba(99,102,241,0.08);
          --badge-bd:         rgba(99,102,241,0.18);
          --badge-tx:         #6366f1;
          --online-bg:        #ecfdf5;
          --online-bd:        rgba(16,185,129,0.2);
          --online-tx:        #059669;
          --online-dot:       #10b981;
          --shadow-card:      0 1px 8px rgba(0,0,0,0.06);
          --shadow-card-h:    0 8px 24px rgba(0,0,0,0.1);
          --shadow-btn:       0 3px 12px rgba(99,102,241,0.28);
          --shadow-btn-h:     0 4px 16px rgba(99,102,241,0.42);
          --glow:             rgba(99,102,241,0.05);
          --overlay:          rgba(15,15,30,0.45);
        }

        [data-theme="dark"], .dark {
          --bg-page:          #0a0a0f;
          --bg-sidebar:       #0f0f17;
          --bg-main:          #0c0c14;
          --bg-topbar:        rgba(12,12,20,0.92);
          --bg-input-area:    rgba(12,12,20,0.95);
          --bg-bubble-bot:    #14141f;
          --bg-bubble-err:    rgba(239,68,68,0.08);
          --bg-card:          #13131d;
          --bg-card-hover:    #16162a;
          --bg-input:         #14141f;
          --bg-typing:        #14141f;
          --bg-disclaimer:    rgba(234,179,8,0.06);
          --bg-avatar:        rgba(99,102,241,0.12);
          --bg-nav-hover:     rgba(99,102,241,0.08);
          --bg-results:       #0f0f17;
          --border-main:      rgba(255,255,255,0.05);
          --border-card:      rgba(255,255,255,0.05);
          --border-input:     rgba(255,255,255,0.07);
          --border-focus:     rgba(99,102,241,0.35);
          --border-avatar:    rgba(99,102,241,0.2);
          --border-doc-img:   rgba(99,102,241,0.2);
          --border-nav-hover: rgba(99,102,241,0.15);
          --text-primary:     #e8e8f0;
          --text-secondary:   #7878a0;
          --text-muted:       #42425c;
          --text-faint:       #2e2e44;
          --text-placeholder: #2e2e44;
          --text-bubble-bot:  #d4d4e8;
          --text-bubble-err:  #f87171;
          --text-nav:         #7878a0;
          --text-logo:        #f0f0f8;
          --text-disclaimer:  #92884a;
          --text-fee-label:   #32324a;
          --text-hint:        #2a2a3e;
          --text-dot:         #4f4f70;
          --accent-text:      #818cf8;
          --accent-light:     rgba(99,102,241,0.08);
          --accent-border:    rgba(99,102,241,0.18);
          --badge-bg:         rgba(99,102,241,0.12);
          --badge-bd:         rgba(99,102,241,0.2);
          --badge-tx:         #818cf8;
          --online-bg:        rgba(16,185,129,0.1);
          --online-bd:        rgba(16,185,129,0.2);
          --online-tx:        #34d399;
          --online-dot:       #10b981;
          --shadow-card:      0 1px 8px rgba(0,0,0,0.3);
          --shadow-card-h:    0 8px 24px rgba(0,0,0,0.4);
          --shadow-btn:       0 3px 12px rgba(99,102,241,0.35);
          --shadow-btn-h:     0 4px 16px rgba(99,102,241,0.5);
          --glow:             rgba(99,102,241,0.07);
          --overlay:          rgba(0,0,0,0.65);
        }

        /* ═══════════════════════════════
           RESET
        ═══════════════════════════════ */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ═══════════════════════════════
           ROOT LAYOUT
        ═══════════════════════════════ */
        .askai-root {
          display: flex;
          height: 100vh;
          height: 100dvh; /* dynamic viewport for mobile browsers */
          background: var(--bg-page);
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          overflow: hidden;
          position: relative;
          transition: background 0.25s, color 0.25s;
        }

        .askai-root::before {
          content: '';
          position: fixed;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 500px;
          background: radial-gradient(ellipse, var(--glow) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ═══════════════════════════════
           OVERLAY (mobile panels)
        ═══════════════════════════════ */
        .panel-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: var(--overlay);
          z-index: 40;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }
        .panel-overlay.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ═══════════════════════════════
           SIDEBAR
        ═══════════════════════════════ */
        .sidebar {
          width: 248px;
          min-width: 248px;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-main);
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          position: relative;
          z-index: 1;
          transition: background 0.25s, border-color 0.25s, transform 0.3s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
        }

        .sidebar-logo {
          padding: 0 22px 28px;
          display: flex; align-items: center; gap: 11px;
          border-bottom: 1px solid var(--border-main);
          margin-bottom: 24px;
          transition: border-color 0.25s;
        }
        .logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 0 18px rgba(99,102,241,0.3);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--text-logo); letter-spacing: -0.3px;
          transition: color 0.25s;
        }
        .logo-text span { color: var(--accent-text); }

        .nav-section { flex: 1; padding: 0 14px; }
        .nav-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 8px; margin-bottom: 10px;
          transition: color 0.25s;
        }
        .nav-item {
          width: 100%; text-align: left;
          background: transparent; border: 1px solid transparent;
          border-radius: 9px; padding: 9px 12px;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: var(--text-nav); cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 3px;
        }
        .nav-item:hover {
          background: var(--bg-nav-hover);
          border-color: var(--border-nav-hover);
          color: var(--text-primary);
        }
        .nav-item:hover .nav-arrow { opacity: 1; transform: translateX(0); color: var(--accent-text); }
        .nav-arrow { opacity: 0; transform: translateX(-4px); transition: all 0.18s; }

        .sidebar-footer {
          padding: 18px 14px 0;
          border-top: 1px solid var(--border-main);
          transition: border-color 0.25s;
        }
        .disclaimer-card {
          background: var(--bg-disclaimer);
          border: 1px solid rgba(234,179,8,0.15);
          border-radius: 10px; padding: 12px 14px;
          display: flex; gap: 9px;
        }
        .disclaimer-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #ca8a04; flex-shrink: 0; margin-top: 5px;
        }
        .disclaimer-text {
          font-size: 11px; color: var(--text-disclaimer);
          line-height: 1.6; transition: color 0.25s;
        }

        /* Sidebar close btn (mobile only) */
        .sidebar-close {
          display: none;
          position: absolute; top: 14px; right: 14px;
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--bg-nav-hover); border: 1px solid var(--border-main);
          color: var(--text-primary); cursor: pointer;
          align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .sidebar-close:hover { background: var(--accent-light); color: var(--accent-text); }

        /* ═══════════════════════════════
           MAIN AREA
        ═══════════════════════════════ */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: var(--bg-main);
          position: relative; z-index: 1;
          transition: background 0.25s;
        }

        /* ── Topbar ── */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          background: var(--bg-topbar);
          border-bottom: 1px solid var(--border-main);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 10;
          gap: 12px;
          transition: background 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }
        .topbar-left {
          display: flex; align-items: center; gap: 12px;
          min-width: 0;
        }
        .topbar-right {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }

        /* Icon buttons in topbar */
        .icon-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid var(--border-main);
          background: var(--bg-input);
          color: var(--text-primary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s; flex-shrink: 0;
        }
        .icon-btn:hover { background: var(--accent-light); color: var(--accent-text); border-color: var(--accent-border); }

        /* Hide sidebar toggle on desktop */
        .sidebar-toggle { display: none; }
        .doctors-toggle { display: none; }

        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--text-primary); letter-spacing: -0.2px;
          transition: color 0.25s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .topbar-sub {
          font-size: 11px; color: var(--text-muted);
          display: flex; align-items: center; gap: 6px;
          transition: color 0.25s; white-space: nowrap;
        }
        .topbar-sub::before {
          content: ''; display: inline-block;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--online-dot);
          box-shadow: 0 0 6px rgba(16,185,129,0.5);
          flex-shrink: 0;
        }
        .online-badge {
          display: flex; align-items: center; gap: 6px;
          background: var(--online-bg);
          border: 1px solid var(--online-bd);
          border-radius: 20px; padding: 5px 12px;
          font-size: 12px; color: var(--online-tx); font-weight: 500;
          white-space: nowrap; transition: all 0.25s;
        }

        /* Doctors count badge (mobile topbar) */
        .doc-count-badge {
          position: relative;
        }
        .doc-count-badge .badge-dot {
          position: absolute; top: -4px; right: -4px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #6366f1; color: #fff;
          font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Chat area ── */
        .chat-area {
          flex: 1; overflow-y: auto;
          padding: 24px 24px 16px;
          display: flex; flex-direction: column; gap: 18px;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-border) transparent;
        }
        .chat-area::-webkit-scrollbar { width: 4px; }
        .chat-area::-webkit-scrollbar-thumb { background: var(--accent-border); border-radius: 4px; }

        .msg-row { display: flex; align-items: flex-end; gap: 10px; }
        .msg-row.user { flex-direction: row-reverse; }

        .avatar {
          width: 30px; height: 30px; border-radius: 9px;
          background: var(--bg-avatar); border: 1px solid var(--border-avatar);
          color: var(--accent-text);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.25s;
        }

        .bubble {
          max-width: min(66%, 480px);
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px; line-height: 1.65; font-weight: 300;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
          word-break: break-word;
        }
        .bubble-user {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; border-bottom-right-radius: 4px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.28);
        }
        .bubble-bot {
          background: var(--bg-bubble-bot);
          color: var(--text-bubble-bot);
          border: 1px solid var(--border-card);
          border-bottom-left-radius: 4px;
          box-shadow: var(--shadow-card);
        }
        .bubble-error {
          background: var(--bg-bubble-err);
          border: 1px solid rgba(239,68,68,0.2);
          color: var(--text-bubble-err);
        }

        .typing-bubble {
          background: var(--bg-typing);
          border: 1px solid var(--border-card);
          border-radius: 16px; border-bottom-left-radius: 4px;
          padding: 14px 18px;
          display: flex; gap: 5px; align-items: center;
          box-shadow: var(--shadow-card);
          transition: background 0.25s, border-color 0.25s;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-dot);
          animation: blink 1.3s infinite ease-in-out;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); background: #6366f1; }
        }

        /* ── Quick prompts (mobile chip row) ── */
        .quick-chips {
          display: none;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 8px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-main);
          flex-shrink: 0;
        }
        .quick-chips::-webkit-scrollbar { display: none; }
        .chip {
          flex-shrink: 0;
          background: var(--bg-input);
          border: 1px solid var(--border-input);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px; font-weight: 500;
          color: var(--text-nav);
          cursor: pointer; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .chip:hover { background: var(--accent-light); color: var(--accent-text); border-color: var(--accent-border); }

        /* ── Input area ── */
        .input-area {
          padding: 14px 20px 18px;
          background: var(--bg-input-area);
          border-top: 1px solid var(--border-main);
          transition: background 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }
        .input-wrapper {
          display: flex; align-items: flex-end; gap: 10px;
          background: var(--bg-input);
          border: 1.5px solid var(--border-input);
          border-radius: 14px; padding: 10px 12px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.25s;
        }
        .input-wrapper:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px var(--accent-light);
        }
        .textarea {
          flex: 1; background: transparent; border: none; outline: none;
          resize: none; font-size: 14px; line-height: 1.6;
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          max-height: 100px; overflow-y: auto;
          transition: color 0.25s;
        }
        .textarea::placeholder { color: var(--text-placeholder); }
        .send-btn {
          width: 36px; height: 36px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer;
          transition: all 0.18s; box-shadow: var(--shadow-btn);
        }
        .send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #818cf8, #6366f1);
          box-shadow: var(--shadow-btn-h);
          transform: translateY(-1px);
        }
        .send-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }
        .input-hint {
          font-size: 11px; color: var(--text-hint);
          margin-top: 6px; text-align: center;
          transition: color 0.25s;
        }

        /* ═══════════════════════════════
           RESULTS PANEL
        ═══════════════════════════════ */
        .results-panel {
          width: 296px; min-width: 296px;
          background: var(--bg-results);
          border-left: 1px solid var(--border-main);
          display: flex; flex-direction: column; overflow: hidden;
          position: relative; z-index: 1;
          transition: background 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }
        .results-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border-main);
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
          transition: border-color 0.25s;
          flex-shrink: 0;
        }
        .results-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          color: var(--text-primary); letter-spacing: -0.2px;
          transition: color 0.25s;
        }
        .count-badge {
          font-size: 11px;
          background: var(--badge-bg);
          border: 1px solid var(--badge-bd);
          color: var(--badge-tx);
          border-radius: 20px; padding: 3px 10px; font-weight: 500;
          white-space: nowrap;
        }
        .results-close {
          display: none;
          width: 28px; height: 28px; border-radius: 7px;
          background: var(--bg-nav-hover); border: 1px solid var(--border-main);
          color: var(--text-primary); cursor: pointer;
          align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .results-close:hover { background: var(--accent-light); color: var(--accent-text); }

        .doctor-list {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-border) transparent;
        }
        .doctor-list::-webkit-scrollbar { width: 3px; }
        .doctor-list::-webkit-scrollbar-thumb { background: var(--accent-border); border-radius: 3px; }

        .doctor-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 14px; padding: 14px;
          transition: all 0.2s; box-shadow: var(--shadow-card);
        }
        .doctor-card:hover {
          border-color: var(--accent-border);
          background: var(--bg-card-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-card-h);
        }
        .doc-top { display: flex; gap: 10px; margin-bottom: 10px; }
        .doc-img {
          width: 44px; height: 44px; border-radius: 10px;
          object-fit: cover; border: 1.5px solid var(--border-doc-img);
          flex-shrink: 0;
        }
        .doc-info { flex: 1; min-width: 0; }
        .doc-name {
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 4px;
          transition: color 0.25s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .spec-tag {
          font-size: 10px;
          background: var(--badge-bg); border: 1px solid var(--badge-bd);
          color: var(--badge-tx);
          border-radius: 5px; padding: 2px 7px;
          font-weight: 500; display: inline-block;
        }
        .doc-exp {
          font-size: 11.5px; color: var(--text-muted);
          margin-bottom: 10px; transition: color 0.25s;
        }
        .doc-footer {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid var(--border-card); padding-top: 10px;
          transition: border-color 0.25s;
        }
        .fee-block { display: flex; flex-direction: column; gap: 1px; }
        .fee-label {
          font-size: 9px; color: var(--text-fee-label);
          text-transform: uppercase; letter-spacing: 0.07em;
          transition: color 0.25s;
        }
        .fee-amount {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--text-primary); transition: color 0.25s;
        }
        .book-btn {
          display: flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; border: none;
          border-radius: 8px; padding: 7px 12px;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.18s;
          box-shadow: var(--shadow-btn);
          white-space: nowrap;
        }
        .book-btn:hover {
          background: linear-gradient(135deg, #818cf8, #6366f1);
          box-shadow: var(--shadow-btn-h);
          transform: translateY(-1px);
        }

        /* ═══════════════════════════════
           TABLET — max-width: 1024px
           Collapse results panel to slide-in
        ═══════════════════════════════ */
        @media (max-width: 1024px) {
          .results-panel {
            position: fixed;
            top: 0; right: 0; bottom: 0;
            z-index: 50;
            width: min(320px, 88vw);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.25s, border-color 0.25s;
            box-shadow: -8px 0 32px rgba(0,0,0,0.15);
            border-left: 1px solid var(--border-main);
          }
          .results-panel.open {
            transform: translateX(0);
          }
          .results-close { display: flex; }
          .doctors-toggle { display: flex; }
        }

        /* ═══════════════════════════════
           TABLET — max-width: 860px
           Also collapse sidebar
        ═══════════════════════════════ */
        @media (max-width: 860px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
            box-shadow: 8px 0 32px rgba(0,0,0,0.15);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .sidebar-close { display: flex; }
          .sidebar-toggle { display: flex; }

          /* Show quick chips instead of sidebar nav */
          .quick-chips { display: flex; }

          .topbar { padding: 12px 16px; }
          .topbar-title { font-size: 14px; }
          .topbar-sub { display: none; }

          .chat-area { padding: 16px 16px 12px; }
          .input-area { padding: 10px 14px 14px; }
          .online-badge { padding: 5px 10px; font-size: 11px; }
        }

        /* ═══════════════════════════════
           MOBILE — max-width: 480px
        ═══════════════════════════════ */
        @media (max-width: 480px) {
          .bubble {
            max-width: 85%;
            font-size: 13.5px;
            padding: 10px 14px;
          }
          .chat-area { padding: 14px 12px 10px; gap: 14px; }
          .input-area { padding: 8px 12px 12px; }
          .textarea { font-size: 15px; } /* prevent iOS zoom */
          .online-badge { display: none; }
          .topbar { padding: 10px 12px; }
          .input-hint { display: none; }
          .avatar { width: 26px; height: 26px; border-radius: 7px; }
          .doctor-card { padding: 12px; }
          .doc-img { width: 38px; height: 38px; }
        }

        /* ═══════════════════════════════
           VERY SMALL — max-width: 360px
        ═══════════════════════════════ */
        @media (max-width: 360px) {
          .bubble { max-width: 92%; font-size: 13px; }
          .topbar-title { font-size: 13px; }
          .send-btn { width: 32px; height: 32px; }
        }
      `}</style>

      {/* Overlay for mobile panels */}
      <div
        className={`panel-overlay${(sidebarOpen || doctorsOpen) ? " active" : ""}`}
        onClick={() => { setSidebarOpen(false); setDoctorsOpen(false); }}
      />

      <div className="askai-root">

        {/* ── Sidebar ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <button className="sidebar-close icon-btn" onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </button>
          <div className="sidebar-logo">
            <div className="logo-mark"><BotIcon /></div>
            <span className="logo-text">Medi<span>AI</span></span>
          </div>
          <nav className="nav-section">
            <p className="nav-label">Quick symptoms</p>
            {quickPrompts.map((p, i) => (
              <button key={i} className="nav-item" onClick={() => {
                setInput(p.text);
                setSidebarOpen(false);
                inputRef.current?.focus();
              }}>
                <span>{p.label}</span>
                <span className="nav-arrow"><ChevronIcon /></span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="disclaimer-card">
              <span className="disclaimer-dot" />
              <p className="disclaimer-text">For informational use only. Not a substitute for professional medical advice.</p>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              {/* Hamburger — mobile only */}
              <button className="icon-btn sidebar-toggle" onClick={() => setSidebarOpen(true)}>
                <MenuIcon />
              </button>
              <div>
                <h1 className="topbar-title">AI Health Assistant</h1>
                <p className="topbar-sub">Powered by advanced medical AI</p>
              </div>
            </div>
            <div className="topbar-right">
              <div className="online-badge">
                <PulseIcon /> Online
              </div>
              {/* Doctors panel toggle — tablet/mobile only */}
              {doctors.length > 0 && (
                <button
                  className="icon-btn doctors-toggle doc-count-badge"
                  onClick={() => setDoctorsOpen(o => !o)}
                  title="View recommended doctors"
                >
                  <DoctorIcon />
                  <span className="badge-dot">{doctors.length}</span>
                </button>
              )}
            </div>
          </header>

          {/* Quick chips — mobile only */}
          <div className="quick-chips">
            {quickPrompts.map((p, i) => (
              <button key={i} className="chip" onClick={() => {
                setInput(p.text);
                inputRef.current?.focus();
              }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="chat-area">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row${msg.type === "user" ? " user" : ""}`}>
                {msg.type === "bot" && <div className="avatar"><BotIcon /></div>}
                <div className={`bubble${msg.type === "user" ? " bubble-user" : msg.isError ? " bubble-error" : " bubble-bot"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row">
                <div className="avatar"><BotIcon /></div>
                <div className="typing-bubble">
                  <span className="dot" />
                  <span className="dot" style={{ animationDelay: "0.2s" }} />
                  <span className="dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Describe your symptoms…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="textarea"
              />
              <button onClick={sendMessage} disabled={!input.trim() || loading} className="send-btn">
                <SendIcon />
              </button>
            </div>
            <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </main>

        {/* ── Doctor Results Panel ── */}
        {doctors.length > 0 && (
          <aside className={`results-panel${doctorsOpen ? " open" : ""}`}>
            <div className="results-header">
              <h2 className="results-title">Recommended doctors</h2>
              <span className="count-badge">{doctors.length} found</span>
              <button className="results-close icon-btn" onClick={() => setDoctorsOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="doctor-list">
              {doctors.map((doc) => (
                <div key={doc._id} className="doctor-card">
                  <div className="doc-top">
                    <img src={doc.image} alt={doc.name} className="doc-img" />
                    <div className="doc-info">
                      <h3 className="doc-name">{doc.name}</h3>
                      <span className="spec-tag">{doc.speciality}</span>
                    </div>
                  </div>
                  <p className="doc-exp">{doc.experience}</p>
                  <div className="doc-footer">
                    <div className="fee-block">
                      <span className="fee-label">Consultation fee</span>
                      <span className="fee-amount">₹{doc.fees}</span>
                    </div>
                    <button onClick={() => navigate(`/appointment/${doc._id}`)} className="book-btn">
                      <CalendarIcon /> Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

      </div>
    </>
  );
};

export default AskAI;