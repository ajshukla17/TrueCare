import logo from '../assets/assets/logo_true_carw.png'
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setDropdownOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = showMenu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showMenu]);

  const navLinks = [
    { to: "/", label: "Home", icon: "⌂" },
    { to: "/doctors", label: "All Doctors", icon: "👨‍⚕️" },
    { to: "/about", label: "About", icon: "ℹ" },
    { to: "/contact", label: "Contact", icon: "✉" },
    { to: "/ask-ai", label: "Ask AI", icon: "✦", isAI: true },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&display=swap');

        :root {
          --nav-height: 68px;
          --brand: #0c1f3d;
          --brand-mid: #163563;
          --accent: #00b89c;
          --accent-light: #e0f7f4;
          --accent-glow: rgba(0,184,156,0.18);
          --surface: #ffffff;
          --surface-2: #f8fafd;
          --border: rgba(14,35,75,0.10);
          --border-strong: rgba(14,35,75,0.16);
          --text-primary: #0c1f3d;
          --text-secondary: #536480;
          --text-muted: #94a3b8;
          --shadow-soft: 0 2px 16px rgba(12,31,61,0.07);
          --shadow-lifted: 0 8px 32px rgba(12,31,61,0.13);
          --radius: 10px;
          --nav-font: 'Outfit', sans-serif;
        }

        /* ─── Reset ─── */
        .pn * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── Root ─── */
        .pn {
          font-family: var(--nav-font);
          position: sticky;
          top: 0;
          z-index: 999;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .pn.scrolled {
          box-shadow: var(--shadow-soft);
          border-color: var(--border-strong);
        }

        /* ─── Inner ─── */
        .pn-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ─── Logo ─── */
        .pn-logo-wrap {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
        }

        .pn-logo {
          height: 34px;
          width: auto;
          display: block;
          transition: opacity 0.2s;
        }

        .pn-logo-wrap:hover .pn-logo { opacity: 0.85; }

        /* ─── Desktop links ─── */
        .pn-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          flex: 1;
          justify-content: center;
        }

        .pn-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: var(--radius);
          letter-spacing: 0.01em;
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }

        .pn-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 28px);
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }

        .pn-link:hover {
          color: var(--brand);
          background: var(--surface-2);
        }

        .pn-link.active {
          color: var(--brand);
          font-weight: 600;
          background: var(--surface-2);
        }

        .pn-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* AI link */
        .pn-link.ai {
          background: linear-gradient(135deg, #e0f7f4 0%, #f0fffe 100%);
          color: #00897b;
          font-weight: 600;
          border: 1px solid rgba(0,184,156,0.22);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s;
          padding-left: 12px;
          padding-right: 14px;
        }

        .pn-link.ai::after { display: none; }

        .pn-ai-spark {
          font-size: 12px;
          display: inline-block;
          animation: sparkle 2.2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.7; transform: scale(1.25) rotate(15deg); }
        }

        .pn-link.ai:hover {
          background: linear-gradient(135deg, #ccefec 0%, #e0f7f4 100%);
          color: #00796b;
          border-color: rgba(0,184,156,0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        /* ─── Right side ─── */
        .pn-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* ─── CTA Button ─── */
        .pn-cta {
          background: var(--brand);
          color: #fff;
          border: none;
          padding: 9px 22px;
          border-radius: var(--radius);
          font-size: 13.5px;
          font-weight: 600;
          font-family: var(--nav-font);
          cursor: pointer;
          letter-spacing: 0.02em;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          transition: all 0.22s;
          box-shadow: 0 2px 10px rgba(12,31,61,0.22), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .pn-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .pn-cta:hover {
          background: var(--brand-mid);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(12,31,61,0.30);
        }

        .pn-cta:active { transform: translateY(0); }

        /* ─── User dropdown ─── */
        .pn-user {
          position: relative;
        }

        .pn-user-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 12px 5px 5px;
          border-radius: 40px;
          border: 1.5px solid var(--border-strong);
          background: var(--surface);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(12,31,61,0.05);
        }

        .pn-user-btn:hover, .pn-user-btn.open {
          border-color: #b0c4de;
          box-shadow: 0 3px 12px rgba(12,31,61,0.10);
        }

        .pn-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 2px solid var(--accent-light);
        }

        .pn-uname {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pn-chevron {
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
          flex-shrink: 0;
        }

        .pn-chevron.open { transform: rotate(180deg); }

        /* Dropdown */
        .pn-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 14px;
          padding: 8px;
          min-width: 220px;
          box-shadow: var(--shadow-lifted), 0 0 0 1px rgba(12,31,61,0.03);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-8px) scale(0.97);
          transform-origin: top right;
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }

        .pn-dropdown.open {
          opacity: 1;
          pointer-events: all;
          transform: translateY(0) scale(1);
        }

        /* Dropdown header */
        .pn-dd-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px 12px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 6px;
        }

        .pn-dd-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-light);
          flex-shrink: 0;
        }

        .pn-dd-uname {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .pn-dd-role {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
          font-weight: 400;
        }

        .pn-dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.13s, color 0.13s;
          user-select: none;
        }

        .pn-dd-item:hover {
          background: var(--surface-2);
          color: var(--text-primary);
        }

        .pn-dd-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          transition: background 0.13s;
        }

        .pn-dd-item:hover .pn-dd-icon { background: #edf2ff; }

        .pn-dd-sep {
          height: 1px;
          background: var(--border);
          margin: 6px 4px;
        }

        .pn-dd-item.logout { color: #dc2626; }
        .pn-dd-item.logout:hover { background: #fff1f1; color: #b91c1c; }
        .pn-dd-item.logout:hover .pn-dd-icon { background: #fee2e2; }

        /* ─── Hamburger ─── */
        .pn-burger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1.5px solid var(--border-strong);
          background: var(--surface);
          cursor: pointer;
          transition: all 0.18s;
          flex-direction: column;
          gap: 4.5px;
          flex-shrink: 0;
        }

        .pn-burger:hover { background: var(--surface-2); border-color: #b0c4de; }

        .pn-burger-line {
          display: block;
          width: 18px;
          height: 1.8px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }

        .pn-burger.open .pn-burger-line:nth-child(1) {
          transform: translateY(6.3px) rotate(45deg);
        }
        .pn-burger.open .pn-burger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .pn-burger.open .pn-burger-line:nth-child(3) {
          transform: translateY(-6.3px) rotate(-45deg);
        }

        /* ─── Drawer overlay ─── */
        .pn-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12,31,61,0.40);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
          backdrop-filter: blur(2px);
        }

        .pn-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ─── Drawer ─── */
        .pn-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(300px, 88vw);
          background: var(--surface);
          z-index: 1001;
          transform: translateX(105%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          box-shadow: -12px 0 40px rgba(12,31,61,0.15);
        }

        .pn-drawer.open { transform: translateX(0); }

        .pn-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .pn-drawer-logo { height: 28px; display: block; }

        .pn-drawer-close {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: 1.5px solid var(--border-strong);
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 17px;
          line-height: 1;
          color: var(--text-secondary);
          transition: all 0.15s;
          font-family: var(--nav-font);
        }

        .pn-drawer-close:hover {
          background: #fff1f1;
          color: #dc2626;
          border-color: #fca5a5;
        }

        /* Drawer body */
        .pn-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
        }

        .pn-drawer-section-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding: 4px 10px 8px;
        }

        .pn-drawer-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background 0.14s, color 0.14s;
          margin-bottom: 2px;
        }

        .pn-drawer-link:hover, .pn-drawer-link.active {
          background: var(--surface-2);
          color: var(--text-primary);
          font-weight: 600;
        }

        .pn-drawer-link-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
          transition: background 0.14s;
        }

        .pn-drawer-link:hover .pn-drawer-link-icon,
        .pn-drawer-link.active .pn-drawer-link-icon {
          background: #edf2ff;
        }

        .pn-drawer-link.ai-link {
          background: linear-gradient(135deg, #e0f7f4, #f0fffe);
          color: #00897b;
          font-weight: 600;
          border: 1px solid rgba(0,184,156,0.2);
        }

        .pn-drawer-link.ai-link .pn-drawer-link-icon {
          background: rgba(0,184,156,0.12);
        }

        .pn-drawer-link.ai-link:hover {
          background: linear-gradient(135deg, #ccefec, #e0f7f4);
          border-color: rgba(0,184,156,0.35);
        }

        .pn-drawer-sep {
          height: 1px;
          background: var(--border);
          margin: 10px 4px;
        }

        /* Drawer footer */
        .pn-drawer-footer {
          padding: 14px 16px 20px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }

        .pn-drawer-user-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 14px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .pn-drawer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-light);
          flex-shrink: 0;
        }

        .pn-drawer-uname {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .pn-drawer-urole {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .pn-drawer-logout {
          width: 100%;
          background: transparent;
          border: 1.5px solid #fca5a5;
          color: #dc2626;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: var(--nav-font);
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }

        .pn-drawer-logout:hover {
          background: #fff1f1;
          border-color: #f87171;
        }

        .pn-drawer-cta {
          width: 100%;
          background: var(--brand);
          color: #fff;
          border: none;
          padding: 11px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: var(--nav-font);
          cursor: pointer;
          transition: background 0.18s;
          letter-spacing: 0.02em;
        }

        .pn-drawer-cta:hover { background: var(--brand-mid); }

        /* ─── Responsive ─── */
        @media (max-width: 860px) {
          .pn-links { display: none; }
          .pn-cta { display: none; }
          .pn-user { display: none; }
          .pn-burger { display: flex; }
        }

        @media (max-width: 480px) {
          .pn-inner { padding: 0 18px; }
        }
      `}</style>

      <nav className={`pn${scrolled ? ' scrolled' : ''}`}>
        <div className="pn-inner">

          {/* Logo */}
          <div className="pn-logo-wrap" onClick={() => navigate("/")}>
            <img className="pn-logo" src={logo} alt="CarW Logo" />
          </div>

          {/* Desktop Nav */}
          <ul className="pn-links">
            {navLinks.map(({ to, label, isAI }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `pn-link${isAI ? ' ai' : ''}${isActive && !isAI ? ' active' : ''}`
                  }
                >
                  {isAI && <span className="pn-ai-spark">✦</span>}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="pn-right">
            {token && userData ? (
              <div className="pn-user" ref={dropdownRef}>
                <button
                  className={`pn-user-btn${dropdownOpen ? ' open' : ''}`}
                  onClick={() => setDropdownOpen(o => !o)}
                >
                  <img className="pn-avatar" src={userData.image} alt="avatar" />
                  <span className="pn-uname">{userData.name?.split(" ")[0] || "Account"}</span>
                  <svg className={`pn-chevron${dropdownOpen ? ' open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className={`pn-dropdown${dropdownOpen ? ' open' : ''}`}>
                  {/* Dropdown header */}
                  <div className="pn-dd-header">
                    <img className="pn-dd-avatar" src={userData.image} alt="avatar" />
                    <div>
                      <div className="pn-dd-uname">{userData.name || "Account"}</div>
                      <div className="pn-dd-role">Patient Account</div>
                    </div>
                  </div>

                  <div className="pn-dd-item" onClick={() => { navigate("my-profile"); setDropdownOpen(false); }}>
                    <span className="pn-dd-icon">👤</span> My Profile
                  </div>
                  <div className="pn-dd-item" onClick={() => { navigate("my-appointment"); setDropdownOpen(false); }}>
                    <span className="pn-dd-icon">📅</span> My Appointments
                  </div>
                  <div className="pn-dd-item" onClick={() => { navigate("my-prescription"); setDropdownOpen(false); }}>
                    <span className="pn-dd-icon">℞</span> My Prescriptions
                  </div>
                  <div className="pn-dd-sep" />
                  <div className="pn-dd-item logout" onClick={logout}>
                    <span className="pn-dd-icon">🚪</span> Sign Out
                  </div>
                </div>
              </div>
            ) : (
              <button className="pn-cta" onClick={() => navigate("/login")}>
                Create Account
              </button>
            )}

            {/* Hamburger */}
            <button
              className={`pn-burger${showMenu ? ' open' : ''}`}
              onClick={() => setShowMenu(s => !s)}
              aria-label="Toggle menu"
            >
              <span className="pn-burger-line" />
              <span className="pn-burger-line" />
              <span className="pn-burger-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`pn-overlay${showMenu ? ' open' : ''}`} onClick={() => setShowMenu(false)} />
      <div className={`pn-drawer${showMenu ? ' open' : ''}`}>

        <div className="pn-drawer-head">
          <img className="pn-drawer-logo" src={logo} alt="logo" />
          <button className="pn-drawer-close" onClick={() => setShowMenu(false)}>✕</button>
        </div>

        <div className="pn-drawer-body">
          <div className="pn-drawer-section-label">Navigation</div>

          {navLinks.map(({ to, label, icon, isAI }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `pn-drawer-link${isAI ? ' ai-link' : ''}${isActive && !isAI ? ' active' : ''}`
              }
              onClick={() => setShowMenu(false)}
            >
              <span className="pn-drawer-link-icon">{icon}</span>
              {label}
              {isAI && <span className="pn-ai-spark" style={{ marginLeft: 'auto' }}>✦</span>}
            </NavLink>
          ))}

          {token && userData && (
            <>
              <div className="pn-drawer-sep" />
              <div className="pn-drawer-section-label">My Account</div>
              <NavLink className="pn-drawer-link" to="/my-profile" onClick={() => setShowMenu(false)}>
                <span className="pn-drawer-link-icon">👤</span> My Profile
              </NavLink>
              <NavLink className="pn-drawer-link" to="/my-appointment" onClick={() => setShowMenu(false)}>
                <span className="pn-drawer-link-icon">📅</span> My Appointments
              </NavLink>
              <NavLink className="pn-drawer-link" to="/my-prescription" onClick={() => setShowMenu(false)}>
                <span className="pn-drawer-link-icon">℞</span> My Prescriptions
              </NavLink>
            </>
          )}
        </div>

        <div className="pn-drawer-footer">
          {token && userData ? (
            <>
              <div className="pn-drawer-user-card">
                <img className="pn-drawer-avatar" src={userData.image} alt="avatar" />
                <div>
                  <div className="pn-drawer-uname">{userData.name || "Account"}</div>
                  <div className="pn-drawer-urole">Patient Account</div>
                </div>
              </div>
              <button className="pn-drawer-logout" onClick={() => { logout(); setShowMenu(false); }}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="pn-drawer-cta" onClick={() => { navigate("/login"); setShowMenu(false); }}>
              Create Account
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;