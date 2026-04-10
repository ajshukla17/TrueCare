import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ─── Mock appointment data (replace with real API data) ───────────────────────
const weekData = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 9 },
    { day: "Fri", count: 6 },
    { day: "Sat", count: 3 },
    { day: "Sun", count: 2 },
];

const monthData = [
    { day: "W1", count: 22 },
    { day: "W2", count: 31 },
    { day: "W3", count: 27 },
    { day: "W4", count: 35 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, accent, trend }) => (
    <div
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
    >
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(circle at 80% 20%, ${accent}20 0%, transparent 65%)` }}
        />
        <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                {label}
            </span>
            <span className="text-base sm:text-xl p-1.5 sm:p-2 rounded-xl" style={{ background: `${accent}18`, color: accent }}>
                {icon}
            </span>
        </div>
        <div>
            <p className="text-xl sm:text-3xl font-black tracking-tight leading-none" style={{ color: "var(--text)" }}>
                {value}
            </p>
            {trend !== undefined && (
                <p className="text-[10px] sm:text-xs mt-1 font-medium" style={{ color: trend > 0 ? "#22c55e" : "#ef4444" }}>
                    {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
                </p>
            )}
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>{title}</h2>
        {subtitle && <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: "var(--muted)" }}>{subtitle}</p>}
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        cancelled: { label: "Cancelled", bg: "#fee2e2", color: "#dc2626" },
        completed:  { label: "Completed",  bg: "#dcfce7", color: "#16a34a" },
        pending:    { label: "Pending",    bg: "#fef9c3", color: "#ca8a04" },
    };
    const s = map[status] || map.pending;
    return (
        <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl px-3 py-2 shadow-2xl text-xs" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
            <p className="font-semibold mb-0.5" style={{ color: "var(--muted)" }}>{label}</p>
            <p className="font-bold" style={{ color: "#6366f1" }}>{payload[0].value} appointments</p>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

function DoctorDashboard() {
    const { dashboard, getDashboard } = useContext(DoctorContext);
    const [activeTab, setActiveTab] = useState("week");

    useEffect(() => { getDashboard(); }, []);

    if (!dashboard) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: "#6366f1", animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>
        </div>
    );

    const { doctor, earnings, totalAppointments, totalPatients, recentAppointments } = dashboard;
    const chartData = activeTab === "week" ? weekData : monthData;
    const maxCount = Math.max(...chartData.map(d => d.count));

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
                :root { --bg:#f1f5f9; --card:#ffffff; --border:#e2e8f0; --text:#0f172a; --muted:#64748b; }
                .dash-root { font-family:'Plus Jakarta Sans',sans-serif; }
                .dash-root * { box-sizing:border-box; }
                .recharts-cartesian-axis-tick text { font-family:'Plus Jakarta Sans',sans-serif !important; font-size:10px; fill:#94a3b8; }
            `}</style>

            <div className="dash-root w-full min-h-screen" style={{ background: "var(--bg)" }}>
                <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-7 space-y-3 sm:space-y-4 lg:space-y-5">

                    {/* ── Header ── */}
                    <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#6366f1" }}>
                                Doctor Portal
                            </p>
                            <h1 className="text-base sm:text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>
                                Good morning, {doctor.name.split(" ")[0]} 👋
                            </h1>
                            <p className="text-xs sm:text-sm mt-0.5 hidden sm:block" style={{ color: "var(--muted)" }}>
                                Here's what's happening with your practice today.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold leading-tight" style={{ color: "var(--text)" }}>{doctor.name}</p>
                                <p className="text-xs" style={{ color: "var(--muted)" }}>{doctor.speciality}</p>
                            </div>
                            <div className="relative">
                                <img src={doctor.image} alt={doctor.name}
                                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-indigo-400 ring-offset-2" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                        <StatCard label="Earnings"     value={`₹${Number(earnings).toLocaleString("en-IN")}`} icon="💰" accent="#22c55e" trend={12.4} />
                        <StatCard label="Appointments" value={totalAppointments} icon="📅"  accent="#6366f1" trend={8.1}  />
                        <StatCard label="Patients"     value={totalPatients}     icon="🧑‍⚕️" accent="#f59e0b" trend={-2.3} />
                    </div>

                    {/* ── Appointments Bar Chart ── */}
                    <div className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 flex-wrap">
                            <SectionHeader title="Appointments Overview" subtitle="Appointment volume by day" />
                            <div className="flex gap-1 p-1 rounded-lg flex-shrink-0" style={{ background: "var(--bg)" }}>
                                {["week", "month"].map(t => (
                                    <button key={t} onClick={() => setActiveTab(t)}
                                        className="text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-md transition-all"
                                        style={{
                                            background: activeTab === t ? "var(--card)" : "transparent",
                                            color: activeTab === t ? "#6366f1" : "var(--muted)",
                                            boxShadow: activeTab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                        }}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={140}>
                            <BarChart data={chartData} margin={{ top: 0, right: 4, left: -26, bottom: 0 }}
                                barSize={activeTab === "week" ? 22 : 36}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#6366f108" }} />
                                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                                    {chartData.map((d, i) => (
                                        <Cell key={i} fill={d.count === maxCount ? "#6366f1" : "#e0e7ff"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ── Profile + Recent Appointments ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

                        {/* Profile */}
                        <div className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                            {/* Mobile: horizontal; sm+: vertical centered */}
                            <div className="flex sm:flex-col items-center gap-3 sm:gap-0 sm:text-center">
                                <div className="relative flex-shrink-0">
                                    <img src={doctor.image} alt={doctor.name}
                                        className="w-14 h-14 sm:w-20 sm:h-20 sm:mb-3 rounded-2xl object-cover shadow-md" />
                                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                </div>
                                <div className="min-w-0 text-left sm:text-center">
                                    <h3 className="font-bold text-sm sm:text-base truncate" style={{ color: "var(--text)" }}>
                                        {doctor.name}
                                    </h3>
                                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#6366f1" }}>
                                        {doctor.speciality}
                                    </p>
                                </div>
                            </div>
                            <div className="flex divide-x rounded-xl overflow-hidden mt-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                                {[
                                    { label: "Exp.", value: doctor.experience },
                                    { label: "Rating", value: doctor.rating ? `${doctor.rating}★` : "4.9★" },
                                    { label: "Fee", value: `₹${doctor.fees ?? "–"}` },
                                ].map((s, i) => (
                                    <div key={i} className="flex-1 py-2.5 px-1 text-center">
                                        <p className="text-[9px] sm:text-[10px]" style={{ color: "var(--muted)" }}>{s.label}</p>
                                        <p className="text-[10px] sm:text-xs font-bold mt-0.5 truncate" style={{ color: "var(--text)" }}>{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <div className="sm:col-span-2 rounded-2xl p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                            <SectionHeader title="Recent Appointments" subtitle="Latest patient visits" />
                            <div className="space-y-2">
                                {recentAppointments.slice(0, 5).map((apt, i) => (
                                    <div key={i}
                                        className="flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-xl transition-all hover:shadow-sm gap-2"
                                        style={{ background: "var(--bg)" }}>
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <div
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ background: `hsl(${(i * 67 + 200) % 360}, 65%, 55%)` }}>
                                                {apt.userData.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                                                    {apt.userData.name}
                                                </p>
                                                <p className="text-[10px] sm:text-xs truncate" style={{ color: "var(--muted)" }}>
                                                    {apt.slotDate} · {apt.slotTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                                            <StatusBadge status={apt.cancelled ? "cancelled" : apt.isCompleted ? "completed" : "pending"} />
                                            <span className="text-xs sm:text-sm font-bold" style={{ color: "#22c55e" }}>
                                                ₹{apt.amount}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorDashboard;