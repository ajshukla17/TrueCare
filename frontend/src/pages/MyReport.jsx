import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const REPORT_TYPES = ["X-Ray", "MRI", "CT Scan", "Blood Test", "ECG", "Ultrasound", "Pathology", "Other"];

const TYPE_META = {
  "X-Ray":      { icon: "🦴", color: "#3b5bdb", bg: "#edf2ff" },
  "MRI":        { icon: "🧠", color: "#7048e8", bg: "#f3f0ff" },
  "CT Scan":    { icon: "🩻", color: "#0c8599", bg: "#e3fafc" },
  "Blood Test": { icon: "🩸", color: "#c92a2a", bg: "#fff5f5" },
  "ECG":        { icon: "💓", color: "#e67700", bg: "#fff9db" },
  "Ultrasound": { icon: "🔊", color: "#2f9e44", bg: "#ebfbee" },
  "Pathology":  { icon: "🔬", color: "#862e9c", bg: "#f8f0fc" },
  "Other":      { icon: "📄", color: "#495057", bg: "#f8f9fa" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MyReports() {
  const { backendurl, token } = useContext(AppContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [previewReport, setPreviewReport] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: "",
    reportType: "X-Ray",
    description: "",
    doctorName: "",
    reportDate: "",
    file: null,
  });

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/report/my-reports", {
        headers: { token },
      });
      if (data.success) setReports(data.reports);
      else toast.error(data.message);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReports();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB.");
      return;
    }
    setForm((f) => ({ ...f, file }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Please enter a report title.");
    if (!form.file) return toast.error("Please select a file to upload.");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("reportType", form.reportType);
      fd.append("description", form.description.trim());
      fd.append("doctorName", form.doctorName.trim());
      fd.append("reportDate", form.reportDate);
      fd.append("reportFile", form.file);

      const { data } = await axios.post(backendurl + "/api/report/upload", fd, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Report uploaded successfully!");
        setReports((prev) => [data.report, ...prev]);
        setShowForm(false);
        setForm({ title: "", reportType: "X-Ray", description: "", doctorName: "", reportDate: "", file: null });
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/report/delete",
        { reportId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Report deleted.");
        setReports((prev) => prev.filter((r) => r._id !== reportId));
        setDeleteConfirm(null);
        if (previewReport && previewReport._id === reportId) setPreviewReport(null);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const filtered = reports.filter((r) => {
    const matchType = filterType === "All" || r.reportType === filterType;
    const matchSearch =
      !searchQ ||
      r.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      (r.doctorName && r.doctorName.toLowerCase().includes(searchQ.toLowerCase()));
    return matchType && matchSearch;
  });

  const typeCounts = REPORT_TYPES.reduce((acc, t) => {
    acc[t] = reports.filter((r) => r.reportType === t).length;
    return acc;
  }, {});

  const isImage = (r) =>
    r.fileUrl && /\.(jpg|jpeg|png|webp)$/i.test(r.fileUrl.split("?")[0]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        .mr-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 80vh;
          padding: 36px 0 60px;
          color: #0f172a;
        }

        /* ─── Hero ─── */
        .mr-hero {
          background: linear-gradient(135deg, #0c1f3d 0%, #163563 55%, #0c1f3d 100%);
          border-radius: 20px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .mr-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(0,184,156,0.10);
          pointer-events: none;
        }
        .mr-hero-left h1 {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 6px;
        }
        .mr-hero-left p {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          margin: 0;
          max-width: 400px;
          line-height: 1.6;
        }
        .mr-hero-badge {
          background: rgba(0,184,156,0.15);
          border: 1px solid rgba(0,184,156,0.30);
          color: #5eead4;
          font-size: 13px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 30px;
          margin-top: 12px;
          display: inline-block;
        }
        .mr-upload-btn {
          background: linear-gradient(135deg, #00b89c, #00897b);
          color: #fff;
          border: none;
          padding: 13px 26px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 9px;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,184,156,0.35);
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .mr-upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,184,156,0.45);
        }

        /* ─── Stats Row ─── */
        .mr-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .mr-stat-card {
          background: #fff;
          border: 1.5px solid #e8edf5;
          border-radius: 14px;
          padding: 14px 20px;
          min-width: 120px;
          cursor: pointer;
          transition: all 0.18s;
          flex: 1;
        }
        .mr-stat-card:hover, .mr-stat-card.active {
          border-color: var(--sc, #3b5bdb);
          background: var(--sb, #edf2ff);
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }
        .mr-stat-icon { font-size: 22px; margin-bottom: 4px; }
        .mr-stat-count { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1; }
        .mr-stat-label { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.04em; }

        /* ─── Toolbar ─── */
        .mr-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .mr-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .mr-search-wrap svg {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .mr-search {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background: #fff;
          transition: border 0.18s;
          box-sizing: border-box;
        }
        .mr-search:focus { outline: none; border-color: #3b5bdb; }
        .mr-filter-select {
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background: #fff;
          cursor: pointer;
          transition: border 0.18s;
        }
        .mr-filter-select:focus { outline: none; border-color: #3b5bdb; }

        /* ─── Grid ─── */
        .mr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        /* ─── Report Card ─── */
        .mr-card {
          background: #fff;
          border: 1.5px solid #e8edf5;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
        }
        .mr-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border-color: #c7d2fe;
        }
        .mr-card-thumb {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          position: relative;
          overflow: hidden;
        }
        .mr-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .mr-card-thumb .mr-pdf-icon {
          font-size: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .mr-card-thumb .mr-pdf-icon span {
          font-size: 11px;
          font-weight: 700;
          color: #c92a2a;
          background: #fff5f5;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid #fca5a5;
        }
        .mr-card-body { padding: 16px 18px; }
        .mr-card-type-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
        }
        .mr-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mr-card-meta {
          font-size: 12px;
          color: #64748b;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }
        .mr-card-meta span { display: flex; align-items: center; gap: 4px; }
        .mr-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px 14px;
          border-top: 1px solid #f1f5f9;
          gap: 8px;
        }
        .mr-btn-view {
          background: #edf2ff;
          color: #3b5bdb;
          border: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mr-btn-view:hover { background: #dbe4ff; }
        .mr-btn-del {
          background: #fff5f5;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mr-btn-del:hover { background: #fee2e2; }

        /* ─── Empty ─── */
        .mr-empty {
          text-align: center;
          padding: 64px 24px;
          color: #64748b;
        }
        .mr-empty-icon { font-size: 64px; margin-bottom: 16px; }
        .mr-empty h3 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .mr-empty p { font-size: 14px; line-height: 1.6; max-width: 360px; margin: 0 auto 20px; }
        .mr-empty-cta {
          background: #0c1f3d;
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: background 0.18s;
        }
        .mr-empty-cta:hover { background: #163563; }

        /* ─── Upload Modal ─── */
        .mr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.55);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .mr-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          animation: slideUp 0.22s cubic-bezier(0.34,1.3,0.64,1);
        }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .mr-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 26px 18px;
          border-bottom: 1px solid #f1f5f9;
        }
        .mr-modal-head h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .mr-modal-close {
          width: 34px; height: 34px;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .mr-modal-close:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
        .mr-modal-body { padding: 24px 26px 26px; }
        .mr-field { margin-bottom: 18px; }
        .mr-label {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #374151;
          margin-bottom: 6px;
        }
        .mr-label span { color: #dc2626; margin-left: 2px; }
        .mr-input, .mr-select, .mr-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background: #fff;
          transition: border 0.18s;
          box-sizing: border-box;
        }
        .mr-input:focus, .mr-select:focus, .mr-textarea:focus {
          outline: none;
          border-color: #3b5bdb;
          box-shadow: 0 0 0 3px rgba(59,91,219,0.08);
        }
        .mr-textarea { resize: vertical; min-height: 72px; }
        .mr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Dropzone */
        .mr-dropzone {
          border: 2px dashed #c7d2fe;
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.18s;
          background: #f8faff;
          position: relative;
        }
        .mr-dropzone:hover, .mr-dropzone.has-file {
          border-color: #3b5bdb;
          background: #edf2ff;
        }
        .mr-dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .mr-dropzone-icon { font-size: 36px; margin-bottom: 8px; }
        .mr-dropzone-text { font-size: 13.5px; font-weight: 600; color: #3b5bdb; }
        .mr-dropzone-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
        .mr-file-chosen {
          font-size: 13px;
          font-weight: 600;
          color: #2f9e44;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        /* Modal Actions */
        .mr-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }
        .mr-btn-cancel {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mr-btn-cancel:hover { background: #e2e8f0; }
        .mr-btn-submit {
          flex: 2;
          background: linear-gradient(135deg, #0c1f3d, #163563);
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .mr-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .mr-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* ─── Preview Modal ─── */
        .mr-preview-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.22);
          animation: slideUp 0.22s cubic-bezier(0.34,1.3,0.64,1);
        }
        .mr-preview-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 22px 26px 16px;
          border-bottom: 1px solid #f1f5f9;
          gap: 16px;
        }
        .mr-preview-title { font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .mr-preview-img {
          width: 100%;
          max-height: 500px;
          object-fit: contain;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .mr-preview-pdf-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          color: #c92a2a;
          text-decoration: none;
          border: 2px dashed #fca5a5;
          transition: all 0.18s;
        }
        .mr-preview-pdf-link:hover { background: #fff5f5; }
        .mr-preview-body { padding: 22px 26px; }
        .mr-preview-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .mr-info-item label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; display: block; margin-bottom: 3px; }
        .mr-info-item span { font-size: 14px; font-weight: 600; color: #0f172a; }
        .mr-preview-desc { font-size: 14px; color: #374151; line-height: 1.6; padding: 14px 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #e8edf5; }
        .mr-preview-actions { display: flex; gap: 10px; margin-top: 22px; }
        .mr-btn-open {
          flex: 1;
          background: #0c1f3d;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: all 0.18s;
        }
        .mr-btn-open:hover { background: #163563; }

        /* ─── Delete Confirm ─── */
        .mr-del-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 380px;
          padding: 30px 28px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.16);
          text-align: center;
          animation: slideUp 0.2s cubic-bezier(0.34,1.3,0.64,1);
        }
        .mr-del-icon { font-size: 44px; margin-bottom: 12px; }
        .mr-del-modal h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .mr-del-modal p { font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
        .mr-del-actions { display: flex; gap: 10px; }
        .mr-btn-keep {
          flex: 1; background: #f1f5f9; color: #475569; border: none;
          padding: 11px; border-radius: 10px; font-size: 14px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: background 0.15s;
        }
        .mr-btn-keep:hover { background: #e2e8f0; }
        .mr-btn-confirm-del {
          flex: 1; background: #dc2626; color: #fff; border: none;
          padding: 11px; border-radius: 10px; font-size: 14px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: background 0.15s;
        }
        .mr-btn-confirm-del:hover { background: #b91c1c; }

        /* ─── Loading ─── */
        .mr-loading {
          display: flex; align-items: center; justify-content: center;
          padding: 80px 24px; gap: 14px; color: #64748b; font-size: 15px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mr-spinner {
          width: 28px; height: 28px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b5bdb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 640px) {
          .mr-hero { flex-direction: column; align-items: flex-start; padding: 24px; }
          .mr-upload-btn { width: 100%; justify-content: center; }
          .mr-row { grid-template-columns: 1fr; }
          .mr-stats { gap: 8px; }
          .mr-stat-card { min-width: 80px; padding: 10px 14px; }
          .mr-preview-info { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="mr-wrap">

        {/* Hero */}
        <div className="mr-hero">
          <div className="mr-hero-left">
            <h1>🗂️ My Medical Reports</h1>
            <p>Securely store and access your X-rays, MRI scans, blood tests, and all medical reports in one place.</p>
            <span className="mr-hero-badge">🔒 {reports.length} report{reports.length !== 1 ? "s" : ""} stored</span>
          </div>
          <button className="mr-upload-btn" onClick={() => setShowForm(true)}>
            <span style={{ fontSize: 18 }}>+</span> Upload New Report
          </button>
        </div>

        {/* Type Stats */}
        {reports.length > 0 && (
          <div className="mr-stats">
            <div
              className={`mr-stat-card${filterType === "All" ? " active" : ""}`}
              style={{ "--sc": "#0c1f3d", "--sb": "#edf2ff" }}
              onClick={() => setFilterType("All")}
            >
              <div className="mr-stat-icon">📁</div>
              <div className="mr-stat-count">{reports.length}</div>
              <div className="mr-stat-label">All</div>
            </div>
            {REPORT_TYPES.filter((t) => typeCounts[t] > 0).map((t) => {
              const m = TYPE_META[t];
              return (
                <div
                  key={t}
                  className={`mr-stat-card${filterType === t ? " active" : ""}`}
                  style={{ "--sc": m.color, "--sb": m.bg }}
                  onClick={() => setFilterType(t)}
                >
                  <div className="mr-stat-icon">{m.icon}</div>
                  <div className="mr-stat-count">{typeCounts[t]}</div>
                  <div className="mr-stat-label">{t}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Toolbar */}
        {reports.length > 0 && (
          <div className="mr-toolbar">
            <div className="mr-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="mr-search"
                placeholder="Search reports or doctor name..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <select
              className="mr-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              {REPORT_TYPES.map((t) => <option key={t} value={t}>{TYPE_META[t].icon} {t}</option>)}
            </select>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="mr-loading"><div className="mr-spinner" /> Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div className="mr-empty">
            <div className="mr-empty-icon">{reports.length === 0 ? "🗂️" : "🔍"}</div>
            <h3>{reports.length === 0 ? "No reports yet" : "No matching reports"}</h3>
            <p>{reports.length === 0 ? "Upload your first medical report — X-rays, MRI scans, blood tests and more." : "Try a different search or filter."}</p>
            {reports.length === 0 && (
              <button className="mr-empty-cta" onClick={() => setShowForm(true)}>Upload Your First Report</button>
            )}
          </div>
        ) : (
          <div className="mr-grid">
            {filtered.map((r) => {
              const m = TYPE_META[r.reportType] || TYPE_META["Other"];
              return (
                <div key={r._id} className="mr-card" onClick={() => setPreviewReport(r)}>
                  <div className="mr-card-thumb" style={{ background: m.bg }}>
                    {isImage(r) ? (
                      <img src={r.fileUrl} alt={r.title} />
                    ) : (
                      <div className="mr-pdf-icon">
                        <span style={{ fontSize: 48 }}>📄</span>
                        <span>PDF</span>
                      </div>
                    )}
                  </div>
                  <div className="mr-card-body">
                    <div className="mr-card-type-chip" style={{ color: m.color, background: m.bg }}>
                      {m.icon} {r.reportType}
                    </div>
                    <div className="mr-card-title">{r.title}</div>
                    <div className="mr-card-meta">
                      {r.doctorName && <span>👨‍⚕️ {r.doctorName}</span>}
                      {r.reportDate && <span>📅 {formatDate(r.reportDate)}</span>}
                      <span>🕐 {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="mr-card-footer" onClick={(e) => e.stopPropagation()}>
                    <button className="mr-btn-view" onClick={() => setPreviewReport(r)}>View Report</button>
                    <button className="mr-btn-del" onClick={() => setDeleteConfirm(r)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Upload Modal ─── */}
      {showForm && (
        <div className="mr-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="mr-modal">
            <div className="mr-modal-head">
              <h2>📤 Upload Medical Report</h2>
              <button className="mr-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="mr-modal-body">
              <div className="mr-field">
                <label className="mr-label">Report Title <span>*</span></label>
                <input
                  className="mr-input"
                  placeholder="e.g. Chest X-Ray – Jan 2025"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div className="mr-field">
                <label className="mr-label">Report Type <span>*</span></label>
                <select
                  className="mr-select"
                  value={form.reportType}
                  onChange={(e) => setForm((f) => ({ ...f, reportType: e.target.value }))}
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{TYPE_META[t].icon} {t}</option>
                  ))}
                </select>
              </div>

              <div className="mr-row">
                <div className="mr-field">
                  <label className="mr-label">Doctor / Lab Name</label>
                  <input
                    className="mr-input"
                    placeholder="Dr. Sharma / Apollo Lab"
                    value={form.doctorName}
                    onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                  />
                </div>
                <div className="mr-field">
                  <label className="mr-label">Report Date</label>
                  <input
                    className="mr-input"
                    type="date"
                    value={form.reportDate}
                    onChange={(e) => setForm((f) => ({ ...f, reportDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mr-field">
                <label className="mr-label">Description / Notes</label>
                <textarea
                  className="mr-textarea"
                  placeholder="Optional notes about this report..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="mr-field">
                <label className="mr-label">Upload File <span>*</span></label>
                <div className={`mr-dropzone${form.file ? " has-file" : ""}`}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileChange}
                  />
                  <div className="mr-dropzone-icon">{form.file ? "✅" : "📁"}</div>
                  <div className="mr-dropzone-text">
                    {form.file ? "File selected" : "Click or drag file here"}
                  </div>
                  <div className="mr-dropzone-sub">JPG, PNG, WEBP, or PDF · Max 10MB</div>
                  {form.file && (
                    <div className="mr-file-chosen">✓ {form.file.name}</div>
                  )}
                </div>
              </div>

              <div className="mr-modal-actions">
                <button className="mr-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="mr-btn-submit" onClick={handleSubmit} disabled={uploading}>
                  {uploading ? <><div className="mr-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Uploading…</> : "📤 Upload Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Preview Modal ─── */}
      {previewReport && (
        <div className="mr-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPreviewReport(null); }}>
          <div className="mr-preview-modal">
            <div className="mr-preview-head">
              <div>
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    color: TYPE_META[previewReport.reportType]?.color,
                    background: TYPE_META[previewReport.reportType]?.bg,
                    padding: "3px 10px", borderRadius: 20, marginBottom: 8,
                  }}
                >
                  {TYPE_META[previewReport.reportType]?.icon} {previewReport.reportType}
                </div>
                <div className="mr-preview-title">{previewReport.title}</div>
              </div>
              <button className="mr-modal-close" onClick={() => setPreviewReport(null)}>✕</button>
            </div>
            <div className="mr-preview-body">
              {isImage(previewReport) ? (
                <img className="mr-preview-img" src={previewReport.fileUrl} alt={previewReport.title} />
              ) : (
                <a className="mr-preview-pdf-link" href={previewReport.fileUrl} target="_blank" rel="noreferrer">
                  📄 Click to open PDF report
                </a>
              )}

              <div className="mr-preview-info" style={{ marginTop: 20 }}>
                {previewReport.doctorName && (
                  <div className="mr-info-item">
                    <label>Doctor / Lab</label>
                    <span>👨‍⚕️ {previewReport.doctorName}</span>
                  </div>
                )}
                {previewReport.reportDate && (
                  <div className="mr-info-item">
                    <label>Report Date</label>
                    <span>📅 {formatDate(previewReport.reportDate)}</span>
                  </div>
                )}
                <div className="mr-info-item">
                  <label>Uploaded On</label>
                  <span>🕐 {new Date(previewReport.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div className="mr-info-item">
                  <label>Report Type</label>
                  <span>{TYPE_META[previewReport.reportType]?.icon} {previewReport.reportType}</span>
                </div>
              </div>

              {previewReport.description && (
                <div className="mr-preview-desc">
                  <strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Notes</strong>
                  <p style={{ margin: "6px 0 0", color: "#374151" }}>{previewReport.description}</p>
                </div>
              )}

              <div className="mr-preview-actions">
                <a className="mr-btn-open" href={previewReport.fileUrl} target="_blank" rel="noreferrer">
                  🔗 Open Full File
                </a>
                <button className="mr-btn-del" style={{ flex: 1 }} onClick={() => { setPreviewReport(null); setDeleteConfirm(previewReport); }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm ─── */}
      {deleteConfirm && (
        <div className="mr-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="mr-del-modal">
            <div className="mr-del-icon">🗑️</div>
            <h3>Delete Report?</h3>
            <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.</p>
            <div className="mr-del-actions">
              <button className="mr-btn-keep" onClick={() => setDeleteConfirm(null)}>Keep It</button>
              <button className="mr-btn-confirm-del" onClick={() => handleDelete(deleteConfirm._id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}