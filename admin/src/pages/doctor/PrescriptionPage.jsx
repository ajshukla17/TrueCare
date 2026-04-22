import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

function PrescriptionPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { backendurl, dtoken } = useContext(DoctorContext);

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", frequency: "Once daily", instructions: "" }
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", frequency: "Once daily", instructions: "" }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        backendurl + "/api/prescription/create",
        { appointmentId, medicines, notes },
        { headers: { dtoken } }
      );

      if (data.success) {
        toast.success("Prescription Saved ✅");
        navigate("/doctor-appointments");
        axios.post(
          backendurl + "/api/doctor/complete-appointment",
          { appointmentId },
          { headers: { dtoken } }
        ).catch(err => console.log(err));
      } else {
        toast.error(data.message);
        setSubmitting(false);
      }
    } catch (err) {
     
      toast.error("Something went wrong ❌");
      setSubmitting(false);
    }
  };

  const frequencyOptions = [
    "Once daily", "Twice daily", "Three times daily",
    "Four times daily", "Every 6 hours", "Every 8 hours",
    "Every 12 hours", "As needed", "Before meals", "After meals", "At bedtime"
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rx-root {
          --navy: #0f2744;
          --navy-mid: #1a3a5c;
          --teal: #00a896;
          --teal-light: #e6f7f5;
          --gold: #c9a84c;
          --gold-light: #fdf6e3;
          --red: #e05252;
          --red-light: #fdf0f0;
          --surface: #f7f9fc;
          --white: #ffffff;
          --border: #dde3ee;
          --text-primary: #0f2744;
          --text-secondary: #5a6a82;
          --text-muted: #8fa0b8;
          --shadow-sm: 0 1px 3px rgba(15,39,68,0.06), 0 1px 2px rgba(15,39,68,0.04);
          --shadow-md: 0 4px 16px rgba(15,39,68,0.08), 0 2px 6px rgba(15,39,68,0.05);
          --shadow-lg: 0 12px 40px rgba(15,39,68,0.12), 0 4px 12px rgba(15,39,68,0.07);
          font-family: 'DM Sans', sans-serif;
          background: var(--surface);
          min-height: 100vh;
          padding: 32px 20px 60px;
          color: var(--text-primary);
        }

        .rx-container {
          max-width: 860px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .rx-header {
          background: var(--navy);
          border-radius: 16px 16px 0 0;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rx-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .rx-symbol {
          width: 52px;
          height: 52px;
          background: rgba(0,168,150,0.2);
          border: 1.5px solid rgba(0,168,150,0.4);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rx-symbol span {
          font-family: 'Crimson Pro', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--teal);
          line-height: 1;
          margin-top: 2px;
        }

        .rx-header-title {
          font-family: 'Crimson Pro', serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          line-height: 1.1;
        }

        .rx-header-sub {
          font-size: 12.5px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
          letter-spacing: 0.3px;
        }

        .rx-appt-badge {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: right;
        }

        .rx-appt-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rx-appt-id {
          font-size: 13px;
          font-weight: 600;
          color: var(--teal);
          font-family: 'DM Mono', monospace;
          margin-top: 2px;
        }

        /* ── Body ── */
        .rx-body {
          background: var(--white);
          border: 1px solid var(--border);
          border-top: none;
          padding: 36px;
        }

        /* ── Section header ── */
        .rx-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .rx-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rx-section-icon {
          width: 32px;
          height: 32px;
          background: var(--teal-light);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--teal);
          font-size: 15px;
        }

        .rx-section-label {
          font-weight: 600;
          font-size: 15px;
          color: var(--navy);
        }

        .rx-section-count {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        /* ── Medicine card ── */
        .rx-med-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 12px;
          transition: box-shadow 0.2s, border-color 0.2s;
          position: relative;
        }

        .rx-med-card:hover {
          border-color: #c0cce0;
          box-shadow: var(--shadow-sm);
        }

        .rx-med-number {
          position: absolute;
          top: 18px;
          left: -14px;
          width: 28px;
          height: 28px;
          background: var(--navy);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(15,39,68,0.25);
        }

        .rx-med-row1 {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .rx-med-row2 {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 12px;
          align-items: end;
        }

        .rx-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rx-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .rx-input {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          width: 100%;
          box-sizing: border-box;
        }

        .rx-input::placeholder {
          color: var(--text-muted);
        }

        .rx-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(0,168,150,0.12);
        }

        .rx-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238fa0b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
          cursor: pointer;
        }

        .rx-remove-btn {
          background: var(--red-light);
          border: 1.5px solid #f5c4c4;
          color: var(--red);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .rx-remove-btn:hover {
          background: #fbdada;
          border-color: var(--red);
        }

        .rx-remove-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── Add button ── */
        .rx-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1.5px dashed #b0c0d8;
          color: var(--text-secondary);
          border-radius: 10px;
          padding: 11px 18px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          width: 100%;
          justify-content: center;
          margin-top: 4px;
        }

        .rx-add-btn:hover {
          border-color: var(--teal);
          color: var(--teal);
          background: var(--teal-light);
        }

        /* ── Divider ── */
        .rx-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 30px 0;
        }

        /* ── Notes ── */
        .rx-notes-textarea {
          resize: vertical;
          min-height: 110px;
          line-height: 1.6;
        }

        /* ── Disclaimer ── */
        .rx-disclaimer {
          background: var(--gold-light);
          border: 1px solid #e8d9a8;
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .rx-disclaimer-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .rx-disclaimer-text {
          font-size: 12px;
          color: #7a6020;
          line-height: 1.6;
        }

        /* ── Footer ── */
        .rx-footer {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 16px 16px;
          padding: 22px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rx-footer-info {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rx-footer-actions {
          display: flex;
          gap: 12px;
        }

        .rx-btn-cancel {
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--text-secondary);
          border-radius: 9px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
        }

        .rx-btn-cancel:hover {
          border-color: #b0c0d8;
          background: var(--surface);
        }

        .rx-btn-save {
          background: var(--teal);
          border: none;
          color: #fff;
          border-radius: 9px;
          padding: 11px 28px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,168,150,0.3);
        }

        .rx-btn-save:hover:not(:disabled) {
          background: #009688;
          box-shadow: 0 6px 20px rgba(0,168,150,0.4);
          transform: translateY(-1px);
        }

        .rx-btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .rx-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .rx-header { padding: 20px 20px; border-radius: 12px 12px 0 0; }
          .rx-body { padding: 22px 20px; }
          .rx-footer { padding: 18px 20px; flex-direction: column; gap: 14px; }
          .rx-footer-actions { width: 100%; }
          .rx-btn-cancel, .rx-btn-save { flex: 1; justify-content: center; }
          .rx-med-row1 { grid-template-columns: 1fr 1fr; }
          .rx-med-row1 > :first-child { grid-column: 1 / -1; }
          .rx-med-row2 { grid-template-columns: 1fr 1fr; }
          .rx-med-row2 > :nth-child(2) { grid-column: 1 / -1; }
          .rx-appt-badge { display: none; }
        }
      `}</style>

      <div className="rx-root">
        <div className="rx-container">

          {/* ── Header ── */}
          <div className="rx-header">
            <div className="rx-header-left">
              <div className="rx-symbol"><span>℞</span></div>
              <div>
                <div className="rx-header-title">Write Prescription</div>
                <div className="rx-header-sub">Complete all fields before saving</div>
              </div>
            </div>
            <div className="rx-appt-badge">
              <div className="rx-appt-label">Appointment ID</div>
              <div className="rx-appt-id">#{appointmentId?.slice(-8)?.toUpperCase() || "—"}</div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="rx-body">

            {/* Medicines Section */}
            <div className="rx-section-header">
              <div className="rx-section-title">
                <div className="rx-section-icon">💊</div>
                <div>
                  <div className="rx-section-label">Prescribed Medicines</div>
                  <div className="rx-section-count">{medicines.length} item{medicines.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="rx-med-card">
                <div className="rx-med-number">{index + 1}</div>

                <div className="rx-med-row1">
                  <div className="rx-field">
                    <label className="rx-label">Medicine Name</label>
                    <input
                      className="rx-input"
                      placeholder="e.g. Paracetamol 500mg"
                      value={med.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="rx-field">
                    <label className="rx-label">Dosage</label>
                    <input
                      className="rx-input"
                      placeholder="e.g. 1 tablet"
                      value={med.dosage}
                      onChange={(e) => handleChange(index, "dosage", e.target.value)}
                    />
                  </div>
                  <div className="rx-field">
                    <label className="rx-label">Duration</label>
                    <input
                      className="rx-input"
                      placeholder="e.g. 7 days"
                      value={med.duration}
                      onChange={(e) => handleChange(index, "duration", e.target.value)}
                    />
                  </div>
                </div>

                <div className="rx-med-row2">
                  <div className="rx-field">
                    <label className="rx-label">Frequency</label>
                    <select
                      className="rx-input rx-select"
                      value={med.frequency}
                      onChange={(e) => handleChange(index, "frequency", e.target.value)}
                    >
                      {frequencyOptions.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="rx-field">
                    <label className="rx-label">Special Instructions</label>
                    <input
                      className="rx-input"
                      placeholder="e.g. Take with food, avoid alcohol"
                      value={med.instructions}
                      onChange={(e) => handleChange(index, "instructions", e.target.value)}
                    />
                  </div>
                  <button
                    className="rx-remove-btn"
                    onClick={() => removeMedicine(index)}
                    disabled={medicines.length === 1}
                    title="Remove medicine"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}

            <button className="rx-add-btn" onClick={addMedicine}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Another Medicine
            </button>

            <hr className="rx-divider" />

            {/* Notes Section */}
            <div className="rx-section-header" style={{ marginBottom: 16 }}>
              <div className="rx-section-title">
                <div className="rx-section-icon">📋</div>
                <div>
                  <div className="rx-section-label">Doctor's Notes & Advice</div>
                  <div className="rx-section-count">Dietary advice, follow-up, warnings</div>
                </div>
              </div>
            </div>

            <div className="rx-field">
              <textarea
                className={`rx-input rx-notes-textarea`}
                placeholder="e.g. Drink plenty of water. Avoid cold food. Follow up in 7 days if symptoms persist. Bed rest advised for 2 days."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="rx-disclaimer">
              <span className="rx-disclaimer-icon">⚠️</span>
              <div className="rx-disclaimer-text">
                <strong>Important:</strong> This prescription will be digitally recorded and shared with the patient. Ensure all medicine names, dosages, and durations are accurate before saving. Saving will mark this appointment as completed.
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="rx-footer">
            <div className="rx-footer-info">
              <span>🔒</span> Securely stored · Patient-accessible
            </div>
            <div className="rx-footer-actions">
              <button className="rx-btn-cancel" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                className="rx-btn-save"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><div className="rx-spinner" /> Saving…</>
                ) : (
                  <>✓ Save Prescription</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default PrescriptionPage;

// #CC82577A 