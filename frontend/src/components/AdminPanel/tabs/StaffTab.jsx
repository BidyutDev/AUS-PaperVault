import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Shield,
  Trash2,
  Plus,
  AlertCircle,
  User as UserIcon,
  Activity,
  CheckCircle,
  BarChart2,
  X,
  AlertTriangle,
  Play,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStaff, addStaff, removeStaff } from "../../../data/staff";
import { getMockUsers } from "../../../data/mockUsers";

const CHART_H = 268;

const staffChartTooltip = {
  contentStyle: {
    background: "rgba(18, 20, 32, 0.96)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    fontSize: "12px",
  },
  labelStyle: { color: "#e2e8f0" },
};

function hashStaffId(id) {
  const s = String(id);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/** Deterministic 0..1 */
function rnd(seed, salt) {
  const x = Math.sin((seed + salt) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Summary cards + chart series keyed by role */
function buildStaffStatsBundle(id, role) {
  const seed = hashStaffId(id);
  const isAdmin = role === "Super Admin" || role === "Root Admin";
  const isMod = role === "Moderator" || role === "Root Moderator";

  if (isAdmin) {
    const promotions = (seed % 15) + 3;
    const audited = (seed % 45) + 12;
    const hooks = (seed % 8) + 1;
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const governanceTrend = months.map((name, i) => ({
      name,
      audits: Math.max(2, Math.round(audited * (0.35 + rnd(seed, i) * 0.45))),
      promotions: Math.max(0, Math.round(promotions * (0.25 + rnd(seed, i + 20) * 0.5))),
    }));
    const posture = [
      { name: "Live hooks", value: hooks, fill: "#34d399" },
      { name: "Queued reviews", value: Math.max(1, Math.round(hooks * 0.55 + rnd(seed, 40) * 4)), fill: "#a78bfa" },
      { name: "Drift alerts", value: Math.max(1, Math.round(hooks * 0.4 + rnd(seed, 41) * 3)), fill: "#60a5fa" },
    ];
    return {
      kind: "admin",
      summary: [
        { label: "Promotions Granted", value: promotions, icon: <Shield size={26} color="#a78bfa" /> },
        { label: "Systems Audited", value: audited, icon: <Activity size={26} color="#60a5fa" /> },
        { label: "Security Hooks", value: hooks, icon: <CheckCircle size={26} color="#34d399" /> },
      ],
      chartLeftTitle: "Governance throughput (6 mo)",
      chartRightTitle: "Security posture mix",
      governanceTrend,
      posture,
    };
  }

  if (isMod) {
    const flags = (seed % 120) + 40;
    const warned = (seed % 30) + 5;
    const disputes = (seed % 50) + 10;
    const weeks = ["W1", "W2", "W3", "W4"];
    const caseLoad = weeks.map((name, i) => ({
      name,
      flags: Math.max(4, Math.round(flags * (0.18 + rnd(seed, i) * 0.22))),
      warns: Math.max(1, Math.round(warned * (0.2 + rnd(seed, i + 10) * 0.35))),
      disputes: Math.max(2, Math.round(disputes * (0.2 + rnd(seed, i + 20) * 0.3))),
    }));
    const severity = [
      { name: "Urgent flags", value: Math.max(3, Math.round(flags * 0.22)), fill: "#f87171" },
      { name: "Standard", value: Math.max(8, Math.round(flags * 0.55)), fill: "#fbbf24" },
      { name: "Low touch", value: Math.max(4, Math.round(flags * 0.23)), fill: "#a78bfa" },
    ];
    return {
      kind: "moderator",
      summary: [
        { label: "Flags Resolved", value: flags, icon: <AlertTriangle size={26} color="#fbbf24" /> },
        { label: "Warned Users", value: warned, icon: <AlertCircle size={26} color="#f87171" /> },
        { label: "Disputes Arbitrated", value: disputes, icon: <Activity size={26} color="#a78bfa" /> },
      ],
      chartLeftTitle: "Weekly moderation load (stacked)",
      chartRightTitle: "Flag severity distribution",
      caseLoad,
      severity,
    };
  }

  const papers = (seed % 340) + 120;
  const approvalPct = 60 + (seed % 38);
  const pending = (seed % 25) + 2;
  const approved = Math.max(0, Math.round((papers * approvalPct) / 100));
  const rejected = Math.max(0, papers - approved - pending);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const throughput = days.map((name, i) => ({
    name,
    checked: Math.max(5, Math.round(papers / 7 + (rnd(seed, i) - 0.5) * 28)),
  }));
  const outcomes = [
    { name: "Approved", value: approved, fill: "#34d399" },
    { name: "Rejected", value: rejected, fill: "#f87171" },
    { name: "Pending", value: pending, fill: "#fbbf24" },
  ];
  return {
    kind: "reviewer",
    summary: [
      { label: "Papers Checked", value: papers, icon: <CheckCircle size={26} color="#34d399" /> },
      { label: "Approval Rate", value: `${approvalPct}%`, icon: <BarChart2 size={26} color="#60a5fa" /> },
      { label: "Pending Queue", value: pending, icon: <Play size={26} color="#fbbf24" /> },
    ],
    chartLeftTitle: "Review throughput (7 days)",
    chartRightTitle: "Outcome mix (totals)",
    throughput,
    outcomes,
  };
}

function StaffStatsCharts({ bundle }) {
  const axisTick = { fill: "#7d8da3", fontSize: 11 };

  if (bundle.kind === "admin") {
    return (
      <div className="admin-staff-charts">
        <div className="admin-staff-chart-card">
          <h4 className="admin-staff-chart-title">{bundle.chartLeftTitle}</h4>
          <ResponsiveContainer width="100%" height={CHART_H}>
            <AreaChart data={bundle.governanceTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="staffAdminAudits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="staffAdminPromo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <RechartsTooltip {...staffChartTooltip} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              <Area type="monotone" dataKey="audits" name="Audits" stroke="#60a5fa" strokeWidth={2} fill="url(#staffAdminAudits)" />
              <Area type="monotone" dataKey="promotions" name="Promotions" stroke="#a78bfa" strokeWidth={2} fill="url(#staffAdminPromo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-staff-chart-card">
          <h4 className="admin-staff-chart-title">{bundle.chartRightTitle}</h4>
          <ResponsiveContainer width="100%" height={CHART_H}>
            <PieChart>
              <Pie
                data={bundle.posture}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
              >
                {bundle.posture.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip {...staffChartTooltip} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (bundle.kind === "moderator") {
    return (
      <div className="admin-staff-charts">
        <div className="admin-staff-chart-card">
          <h4 className="admin-staff-chart-title">{bundle.chartLeftTitle}</h4>
          <ResponsiveContainer width="100%" height={CHART_H}>
            <BarChart data={bundle.caseLoad} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <RechartsTooltip {...staffChartTooltip} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              <Bar dataKey="flags" name="Flags cleared" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
              <Bar dataKey="warns" name="Warnings" stackId="a" fill="#f87171" radius={[0, 0, 0, 0]} />
              <Bar dataKey="disputes" name="Disputes" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-staff-chart-card">
          <h4 className="admin-staff-chart-title">{bundle.chartRightTitle}</h4>
          <ResponsiveContainer width="100%" height={CHART_H}>
            <PieChart>
              <Pie
                data={bundle.severity}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={2}
              >
                {bundle.severity.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip {...staffChartTooltip} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-staff-charts">
      <div className="admin-staff-chart-card">
        <h4 className="admin-staff-chart-title">{bundle.chartLeftTitle}</h4>
        <ResponsiveContainer width="100%" height={CHART_H}>
          <AreaChart data={bundle.throughput} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="staffReviewerChecked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
            <RechartsTooltip {...staffChartTooltip} />
            <Area type="monotone" dataKey="checked" name="Papers checked" stroke="#34d399" strokeWidth={2} fill="url(#staffReviewerChecked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="admin-staff-chart-card">
        <h4 className="admin-staff-chart-title">{bundle.chartRightTitle}</h4>
        <ResponsiveContainer width="100%" height={CHART_H}>
          <PieChart>
            <Pie
              data={bundle.outcomes}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
            >
              {bundle.outcomes.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <RechartsTooltip {...staffChartTooltip} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function StaffTab() {
  const [staffList, setStaffList] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Moderator");
  const [error, setError] = useState("");
  const [mockUsers, setMockUsers] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedStaffForStats, setSelectedStaffForStats] = useState(null);

  useEffect(() => {
    setStaffList(getStaff());
    setMockUsers(getMockUsers());

    const handleUpdate = () => {
      setStaffList(getStaff());
    };

    window.addEventListener("staffUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("staffUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and Password are required.");
      return;
    }

    const res = addStaff(username.trim(), password.trim(), role);
    if (!res.success) {
      setError(res.error);
    } else {
      setUsername("");
      setPassword("");
      setRole("Moderator");
      setError("");
    }
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to revoke this user's admin access?")) {
      const res = removeStaff(id);
      if (!res.success) {
         alert(res.error);
      }
    }
  };

  const rootStaff = staffList.filter(s => s.isRoot);
  const customModerators = staffList.filter(s => !s.isRoot && s.role === "Moderator");
  const customReviewers = staffList.filter(s => !s.isRoot && s.role === "Reviewer");

  const renderCard = (st, idx) => (
    <div 
      key={st.id} 
      className="admin-dept-card" 
      style={{ 
        padding: "0.75rem", 
        minWidth: 0,
        gridColumn: (st.isRoot && idx === 0) ? "1 / -1" : "auto",
        cursor: "pointer"
      }}
      onClick={() => setSelectedStaffForStats(st)}
    >
       <div className="admin-dept-card-color" style={{ background: st.role === "Super Admin" ? "var(--color-vault-danger)" : st.role === "Moderator" ? "var(--color-vault-warning)" : "var(--color-vault-lavender)" }}></div>
       
       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserIcon size={14} color="var(--color-vault-gray)" />
            <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{st.username}</span>
            {st.isRoot && <span style={{ fontSize: "0.55rem", padding: "0.1rem 0.4rem", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "var(--color-vault-gray)" }}>ROOT</span>}
          </div>
          
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-vault-lavender)" }}>
            {st.role.toUpperCase()}
          </div>
       </div>

       {!st.isRoot && (
         <button 
           className="admin-dept-card-delete"
           style={{ position: "absolute", top: "0.5rem", right: "0.5rem", opacity: 1, height: "32px", width: "32px", zIndex: 10 }}
           onClick={(e) => {
             e.stopPropagation();
             handleRemove(st.id);
           }}
           title="Revoke Role"
         >
           <Trash2 size={16} />
         </button>
       )}
    </div>
  );

  let statsModal = null;
  if (selectedStaffForStats) {
    const bundle = buildStaffStatsBundle(selectedStaffForStats.id, selectedStaffForStats.role);
    statsModal = createPortal(
      <div
        className="admin-stats-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-stats-title"
        onClick={() => setSelectedStaffForStats(null)}
      >
        <div className="admin-stats-modal admin-stats-modal--staff" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="admin-stats-close-btn" onClick={() => setSelectedStaffForStats(null)}>
            <X size={20} />
          </button>
          <div className="admin-stats-header">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(139, 92, 246, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserIcon size={22} color="var(--color-vault-lavender)" />
            </div>
            <div>
              <h3 id="staff-stats-title" style={{ margin: 0, color: "#fff", fontSize: "1.2rem" }}>
                {selectedStaffForStats.username}
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--color-vault-gray)", marginTop: "0.25rem" }}>
                {selectedStaffForStats.role.toUpperCase()} — performance overview
              </div>
            </div>
          </div>
          <div className="admin-stats-content">
            <div className="admin-stats-grid admin-stats-grid--staff-summary">
              {bundle.summary.map((stat, i) => (
                <div key={i} className="admin-stats-item">
                  {stat.icon}
                  <div className="admin-stats-metric">{stat.value}</div>
                  <div className="admin-stats-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <StaffStatsCharts bundle={bundle} />
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="admin-analytics-section animate-slideUp" style={{ padding: "2rem", height: "100%", overflowY: "auto" }}>
      {statsModal}

      <div className="admin-departments-header">
        <h2 className="admin-departments-title">
          Staff_Management
          <Shield size={18} style={{ display: "inline", marginLeft: "0.5rem", color: "var(--color-vault-lavender)" }} />
        </h2>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* ADD STAFF FORM */}
        <div className="admin-add-dept-form-container" style={{ flex: "1", minWidth: "250px", maxWidth: "290px" }}>
           <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "var(--color-vault-lavender)", marginBottom: "1rem" }}>Promote User</h3>
           
           {error && (
             <div style={{ padding: "0.5rem", background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.3)", color: "var(--color-vault-danger)", borderRadius: "4px", fontSize: "0.75rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
               <AlertCircle size={14} />
               {error}
             </div>
           )}

           <form onSubmit={handleAddStaff} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             <div className="admin-form-group" style={{ position: "relative" }}>
               <label className="admin-form-label">Username</label>
               <input 
                 type="text" 
                 className="admin-form-input" 
                 placeholder="Search for username..."
                 value={username}
                 onChange={(e) => {
                   setUsername(e.target.value);
                   setShowAutocomplete(true);
                 }}
                 onFocus={() => setShowAutocomplete(true)}
                 onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
               />
               {showAutocomplete && username.length > 0 && (
                 <div style={{
                   position: "absolute",
                   top: "calc(100% + 6px)",
                   left: 0,
                   right: 0,
                   background: "rgba(10, 10, 16, 0.65)",
                   backdropFilter: "blur(12px)",
                   border: "1px solid rgba(255,255,255,0.08)",
                   borderRadius: "8px",
                   maxHeight: "180px",
                   overflowY: "auto",
                   zIndex: 20,
                   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                   display: "flex",
                   flexDirection: "column",
                   gap: "2px",
                   padding: "4px"
                 }}>
                   {mockUsers.filter(u => u.toLowerCase().includes(username.toLowerCase())).length > 0 ? (
                     mockUsers.filter(u => u.toLowerCase().includes(username.toLowerCase())).map(u => (
                       <div 
                         key={u}
                         onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                         onClick={() => {
                           setUsername(u);
                           setShowAutocomplete(false);
                         }}
                         style={{
                           padding: "8px 12px",
                           color: "var(--color-vault-text)",
                           cursor: "pointer",
                           fontSize: "0.85rem",
                           borderRadius: "6px",
                           transition: "all 0.2s ease",
                           display: "flex",
                           alignItems: "center",
                           gap: "8px",
                           background: "transparent"
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                           e.currentTarget.style.color = "#fff";
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.background = "transparent";
                           e.currentTarget.style.color = "var(--color-vault-text)";
                         }}
                       >
                         <UserIcon size={12} style={{ opacity: 0.6 }} />
                         {u}
                       </div>
                     ))
                   ) : (
                     <div style={{ padding: "12px", color: "var(--color-vault-gray)", fontSize: "0.8rem", fontStyle: "italic", textAlign: "center" }}>
                       No matching users found
                     </div>
                   )}
                 </div>
               )}
             </div>

             <div className="admin-form-group">
               <label className="admin-form-label">Temporary Password</label>
               <input 
                 type="text" 
                 className="admin-form-input" 
                 placeholder="Set a local admin password..."
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
               <small style={{ color: "var(--color-vault-gray)", marginTop: "2px", fontSize: "0.55rem" }}>They will use this password to access the Admin Panel.</small>
             </div>

             <div className="admin-form-group">
               <label className="admin-form-label">Assign Role</label>
               <select className="admin-form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                 <option value="Super Admin">Super Admin</option>
                 <option value="Moderator">Moderator</option>
                 <option value="Reviewer">Reviewer</option>
               </select>
             </div>

             <button type="submit" className="admin-add-dept-btn" style={{ justifyContent: "center", marginTop: "0.5rem" }}>
               <Plus size={14} /> Promote Access
             </button>
           </form>
        </div>

        {/* CURRENT STAFF LIST */}
        <div style={{ flex: "4", minWidth: "500px", marginRight: "-10px" }}>
           <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "var(--color-vault-lavender)", marginBottom: "1rem" }}>Active Staff Members</h3>
           
           {/* ROOT USERS */}
           <h4 style={{ fontSize: "0.75rem", color: "var(--color-vault-steel)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
             System Root Nodes <span style={{ opacity: 0.5, marginLeft: "0.5rem" }}>({rootStaff.length})</span>
           </h4>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
             {rootStaff.map(renderCard)}
           </div>

           {/* CUSTOM USERS - Side-by-side Category Columns */}
           {(!customModerators.length && !customReviewers.length) ? null : (
             <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
               
               {/* MODERATORS COLUMN */}
               <div>
                  <h4 style={{ fontSize: "0.75rem", color: "var(--color-vault-warning)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                    Moderators <span style={{ opacity: 0.5, marginLeft: "0.5rem" }}>({customModerators.length})</span>
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                     {customModerators.length > 0 ? customModerators.map(renderCard) : <div style={{ fontSize: "0.8rem", color: "var(--color-vault-gray)", fontStyle: "italic" }}>No moderators assigned</div>}
                  </div>
               </div>

               {/* REVIEWERS COLUMN */}
               <div>
                  <h4 style={{ fontSize: "0.75rem", color: "var(--color-vault-lavender)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                    Reviewers <span style={{ opacity: 0.5, marginLeft: "0.5rem" }}>({customReviewers.length})</span>
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                     {customReviewers.length > 0 ? customReviewers.map(renderCard) : <div style={{ fontSize: "0.8rem", color: "var(--color-vault-gray)", fontStyle: "italic" }}>No reviewers assigned</div>}
                  </div>
               </div>
               
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
