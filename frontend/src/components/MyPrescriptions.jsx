import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";

function MyPrescriptions() {
  const { prescriptions, getPrescriptions } = useContext(AppContext);

  useEffect(() => {
    getPrescriptions();
  }, []);

  const downloadPrescription = async (id) => {
    const element = document.getElementById(`prescription-${id}`);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`prescription-${id}.pdf`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .myrx-root {
          --navy: #0f2744;
          --navy-mid: #1a3a5c;
          --teal: #00a896;
          --teal-light: #e6f7f5;
          --gold: #c9a84c;
          --gold-light: #fdf6e3;
          --surface: #f7f9fc;
          --white: #ffffff;
          --border: #dde3ee;
          --text-primary: #0f2744;
          --text-secondary: #5a6a82;
          --text-muted: #8fa0b8;
          --shadow-sm: 0 1px 3px rgba(15,39,68,0.06), 0 1px 2px rgba(15,39,68,0.04);
          --shadow-md: 0 4px 16px rgba(15,39,68,0.08), 0 2px 6px rgba(15,39,68,0.05);
          --shadow-lg: 0 12px 40px rgba(15,39,68,0.11), 0 4px 12px rgba(15,39,68,0.07);
          font-family: 'DM Sans', sans-serif;
          background: var(--surface);
          min-height: 100vh;
          padding: 36px 20px 60px;
          color: var(--text-primary);
        }

        .myrx-container {
          max-width: 860px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .myrx-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }

        .myrx-page-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .myrx-page-icon {
          width: 48px;
          height: 48px;
          background: var(--navy);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Crimson Pro', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--teal);
          flex-shrink: 0;
        }

        .myrx-page-title {
          font-family: 'Crimson Pro', serif;
          font-size: 30px;
          font-weight: 700;
          color: var(--navy);
          letter-spacing: -0.4px;
          line-height: 1;
        }

        .myrx-page-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .myrx-count-pill {
          background: var(--teal-light);
          border: 1px solid rgba(0,168,150,0.25);
          color: var(--teal);
          font-size: 12.5px;
          font-weight: 600;
          padding: 5px 13px;
          border-radius: 20px;
        }

        /* ── Empty state ── */
        .myrx-empty {
          text-align: center;
          padding: 70px 20px;
          background: var(--white);
          border: 1px dashed var(--border);
          border-radius: 16px;
        }

        .myrx-empty-icon {
          font-size: 48px;
          margin-bottom: 14px;
          opacity: 0.5;
        }

        .myrx-empty-title {
          font-family: 'Crimson Pro', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 6px;
        }

        .myrx-empty-text {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* ── Card ── */
        .myrx-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-bottom: 20px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .myrx-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        /* ── Card top bar ── */
        .myrx-card-topbar {
          background: var(--navy);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .myrx-doctor-row {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .myrx-doctor-avatar {
          width: 40px;
          height: 40px;
          background: rgba(0,168,150,0.2);
          border: 1.5px solid rgba(0,168,150,0.35);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }

        .myrx-doctor-name {
          font-family: 'Crimson Pro', serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .myrx-doctor-spec {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
          letter-spacing: 0.2px;
        }

        .myrx-card-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .myrx-date-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 7px;
          padding: 5px 11px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .myrx-dl-btn {
          background: var(--teal);
          border: none;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s;
          box-shadow: 0 3px 10px rgba(0,168,150,0.35);
          flex-shrink: 0;
        }

        .myrx-dl-btn:hover {
          background: #009688;
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(0,168,150,0.45);
        }

        .myrx-dl-btn:active {
          transform: translateY(0);
        }

        /* ── Card body ── */
        .myrx-card-body {
          padding: 22px 24px;
        }

        /* ── Medicines ── */
        .myrx-med-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.9px;
          margin-bottom: 12px;
        }

        .myrx-med-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .myrx-med-grid {
          display: grid;
          gap: 8px;
          margin-bottom: 18px;
        }

        .myrx-med-row {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 10px 14px;
          gap: 10px;
          transition: border-color 0.15s;
        }

        .myrx-med-row:hover {
          border-color: #c0cce0;
        }

        .myrx-med-pill-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .myrx-med-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--navy);
          flex: 1;
        }

        .myrx-med-meta {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .myrx-med-tag {
          background: var(--teal-light);
          color: #00897b;
          font-size: 11.5px;
          font-weight: 500;
          padding: 3px 9px;
          border-radius: 5px;
          white-space: nowrap;
        }

        .myrx-med-tag.duration {
          background: var(--gold-light);
          color: #7a6020;
        }

        .myrx-med-tag.freq {
          background: #eff3ff;
          color: #3d5af1;
        }

        .myrx-med-instruction {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 4px;
          padding-left: 26px;
        }

        /* ── Notes ── */
        .myrx-notes-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.9px;
          margin-bottom: 10px;
        }

        .myrx-notes-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .myrx-notes-box {
          background: var(--gold-light);
          border: 1px solid #e8d9a8;
          border-radius: 9px;
          padding: 13px 16px;
          font-size: 13.5px;
          color: #5a4a1e;
          line-height: 1.65;
          display: flex;
          gap: 10px;
        }

        .myrx-notes-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Card footer ── */
        .myrx-card-footer {
          padding: 12px 24px;
          border-top: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .myrx-card-footer-left {
          font-size: 11.5px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .myrx-med-count-badge {
          background: var(--navy);
          color: rgba(255,255,255,0.85);
          font-size: 11px;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 20px;
        }

        .myrx-valid-tag {
          font-size: 11.5px;
          color: var(--teal);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 600px) {
          .myrx-page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .myrx-card-topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .myrx-card-topbar-right { width: 100%; justify-content: space-between; }
          .myrx-med-meta { flex-wrap: wrap; }
        }
      `}</style>

      <div className="myrx-root">
        <div className="myrx-container">

          {/* ── Page Header ── */}
          <div className="myrx-page-header">
            <div className="myrx-page-title-group">
              <div className="myrx-page-icon">℞</div>
              <div>
                <div className="myrx-page-title">My Prescriptions</div>
                <div className="myrx-page-sub">Your complete prescription history</div>
              </div>
            </div>
            {prescriptions.length > 0 && (
              <div className="myrx-count-pill">
                {prescriptions.length} record{prescriptions.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* ── Empty State ── */}
          {prescriptions.length === 0 ? (
            <div className="myrx-empty">
              <div className="myrx-empty-icon">📋</div>
              <div className="myrx-empty-title">No Prescriptions Yet</div>
              <div className="myrx-empty-text">Your prescriptions will appear here after a consultation.</div>
            </div>
          ) : (
            prescriptions.map((item, i) => (
              <div
                key={i}
                id={`prescription-${item._id}`}
                className="myrx-card"
              >
                {/* Top Bar */}
                <div className="myrx-card-topbar">
                  <div className="myrx-doctor-row">
                    <div className="myrx-doctor-avatar">🩺</div>
                    <div>
                      <div className="myrx-doctor-name">{item.doctorId?.name}</div>
                      <div className="myrx-doctor-spec">{item.doctorId?.speciality}</div>
                    </div>
                  </div>
                  <div className="myrx-card-topbar-right">
                    <div className="myrx-date-badge">
                      📅 {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <button
                      className="myrx-dl-btn"
                      onClick={() => downloadPrescription(item._id)}
                      title="Download as PDF"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="myrx-card-body">

                  {/* Medicines */}
                  <div className="myrx-med-section-label">
                    <span>💊</span> Medicines
                  </div>

                  <div className="myrx-med-grid">
                    {item.medicines.map((med, idx) => (
                      <div key={idx}>
                        <div className="myrx-med-row">
                          <span className="myrx-med-pill-icon">●</span>
                          <span className="myrx-med-name">{med.name}</span>
                          <div className="myrx-med-meta">
                            {med.dosage && <span className="myrx-med-tag">{med.dosage}</span>}
                            {med.frequency && <span className="myrx-med-tag freq">{med.frequency}</span>}
                            {med.duration && <span className="myrx-med-tag duration">{med.duration}</span>}
                          </div>
                        </div>
                        {med.instructions && (
                          <div className="myrx-med-instruction">ℹ️ {med.instructions}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <>
                      <div className="myrx-notes-section-label">
                        <span>📋</span> Doctor's Notes
                      </div>
                      <div className="myrx-notes-box">
                        <span className="myrx-notes-icon">⚕️</span>
                        <span>{item.notes}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Footer */}
                <div className="myrx-card-footer">
                  <div className="myrx-card-footer-left">
                    <span className="myrx-med-count-badge">{item.medicines.length} medicine{item.medicines.length !== 1 ? "s" : ""}</span>
                    prescribed
                  </div>
                  <div className="myrx-valid-tag">
                    ✓ Verified prescription
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}

export default MyPrescriptions;