import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { atoken, setAtoken } = useContext(AdminContext);
  const { dtoken, setDtoken } = useContext(DoctorContext);

  const isAdmin = !!atoken;
  const isDoctor = !!dtoken;
  const role = isAdmin ? "Admin" : isDoctor ? "Doctor" : "";

  const Logout = () => {
    localStorage.removeItem("aToken");
    localStorage.removeItem("dtoken");
    setAtoken("");
    setDtoken("");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Crimson+Pro:wght@600;700&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-bottom: 1px solid #dde3ee;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 8px rgba(15,39,68,0.06);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Left ── */
        .nav-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .nav-logo {
          height: 34px;
          width: auto;
          cursor: pointer;
          display: block;
        }

        .nav-divider {
          width: 1px;
          height: 22px;
          background: #dde3ee;
          flex-shrink: 0;
        }

        .nav-role-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 4px 11px 4px 8px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.2px;
          transition: background 0.2s;
        }

        .nav-role-badge.admin {
          background: #eff3ff;
          color: #3d5af1;
          border: 1px solid #d4dcfd;
        }

        .nav-role-badge.doctor {
          background: #e6f7f5;
          color: #00897b;
          border: 1px solid rgba(0,168,150,0.25);
        }

        .nav-role-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .admin .nav-role-dot { background: #3d5af1; }
        .doctor .nav-role-dot { background: #00a896; }

        /* ── Right ── */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .nav-user-info {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .nav-user-label {
          font-size: 11px;
          color: #8fa0b8;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }

        .nav-user-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f2744;
          line-height: 1;
        }

        .nav-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          border: 1.5px solid;
        }

        .nav-avatar.admin {
          background: #eff3ff;
          border-color: #d4dcfd;
        }

        .nav-avatar.doctor {
          background: #e6f7f5;
          border-color: rgba(0,168,150,0.25);
        }

        .nav-sep {
          width: 1px;
          height: 22px;
          background: #dde3ee;
        }

        .nav-logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1.5px solid #dde3ee;
          color: #5a6a82;
          padding: 7px 15px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }

        .nav-logout-btn:hover {
          background: #fff1f1;
          border-color: #f5c4c4;
          color: #e05252;
        }

        .nav-logout-icon {
          font-size: 14px;
          transition: transform 0.18s;
        }

        .nav-logout-btn:hover .nav-logout-icon {
          transform: translateX(2px);
        }

        @media (max-width: 540px) {
          .nav-inner { padding: 0 16px; }
          .nav-user-info { display: none; }
          .nav-divider { display: none; }
          .nav-logout-btn span { display: none; }
          .nav-logout-btn { padding: 8px 10px; }
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">

          {/* ── Left: Logo + Role ── */}
          <div className="nav-left">
            <img
              className="nav-logo"
              src={assets.logo}
              alt="logo"
              onClick={() => navigate("/")}
            />

            {role && (
              <>
                <div className="nav-divider" />
                <div className={`nav-role-badge ${isAdmin ? "admin" : "doctor"}`}>
                  <span className="nav-role-dot" />
                  {role} Panel
                </div>
              </>
            )}
          </div>

          {/* ── Right: User + Logout ── */}
          <div className="nav-right">
            {role && (
              <>
                <div
                  className={`nav-avatar ${isAdmin ? "admin" : "doctor"}`}
                  title={role}
                >
                  {isAdmin ? "🛡️" : "🩺"}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-label">Signed in as</span>
                  <span className="nav-user-name">{role}</span>
                </div>
                <div className="nav-sep" />
              </>
            )}

            <button className="nav-logout-btn" onClick={Logout}>
              <span className="nav-logout-icon">→</span>
              <span>Logout</span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;