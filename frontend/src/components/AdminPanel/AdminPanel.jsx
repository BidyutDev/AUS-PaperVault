import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  ArrowLeft,
  SlidersHorizontal,
  Flag,
  X,
  Upload,
  Eye,
  CheckCircle2,
  FileText,
  User,
  AlertTriangle,
  LogOut,
  Plus,
  Settings,
  BarChart3,
  Activity,
  DownloadCloud
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { getDepartments, addDepartment } from "../../data/departments";
import {
  getPendingUploads,
  approveUpload,
  rejectUpload,
  getAllPapers,
} from "../../data/mockPapers";
import "./AdminPanel.css";
import { apiFetch } from "../../api/api";

/** Pending uploads use numeric ids (Date.now); coerce for display. */
function queueIdLabel(id) {
  return String(id).slice(0, 6).toUpperCase();
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [adminTab, setAdminTab] = useState("review"); // 'review' | 'departments' | 'analytics'
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    id: "",
    name: "",
    shortName: "",
    color: "#92bcea",
    semesters: 8,
    years: 5,
  });
  const [editDeptForm, setEditDeptForm] = useState({
    id: "",
    name: "",
    shortName: "",
    color: "#92bcea",
    semesters: 8,
    years: 5,
  });
  const [deptError, setDeptError] = useState("");
  const [deptSuccess, setDeptSuccess] = useState("");
  const [allDepartments, setAllDepartments] = useState(() => getDepartments());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked) return;
    const id = setInterval(() => {
      setLockTimer((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setLoginAttempts(0);
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isLocked]);

  const pending = getPendingUploads();
  const approvedToday = getAllPapers().length;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const data = await apiFetch("/admin/auth" , "POST", {
      body : {
        username,
        password
      }
    });

    if (data.success) {
      setAuthenticated(true);
      setCurrentAdmin(data.data);
      setError("");
      setLoginAttempts(0);
    } else {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);

      if (attempts >= 3) {
        setIsLocked(true);
        setLockTimer(30); // 30-second lockout
        setError("SYSTEM_LOCKOUT — Too many failed attempts. Wait 30s.");
      } else {
        setError(
          `ACCESS_DENIED — Invalid credentials (${3 - attempts} attempts remaining)`,
        );
      }
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentAdmin(null);
    setUsername("");
    setPassword("");
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setDeptError("");
    setDeptSuccess("");

    // Validation
    if (!newDeptForm.id.trim()) {
      setDeptError("Department ID is required");
      return;
    }
    if (!newDeptForm.name.trim()) {
      setDeptError("Department name is required");
      return;
    }
    if (!newDeptForm.shortName.trim()) {
      setDeptError("Short name is required");
      return;
    }

    try {
      // Add the new department
      const deptId = newDeptForm.id.toLowerCase().replace(/\s+/g, "-");
      const semesterCount = parseInt(newDeptForm.semesters) || 8;
      const yearsCount = parseInt(newDeptForm.years) || 5;

      addDepartment({
        id: deptId,
        name: newDeptForm.name,
        shortName: newDeptForm.shortName.toUpperCase(),
        color: newDeptForm.color,
        semesterCount,
        yearsCount,
      });

      // Update local state
      setAllDepartments(getDepartments());

      // Reset form
      setNewDeptForm({
        id: "",
        name: "",
        shortName: "",
        color: "#92bcea",
        semesters: 8,
        years: 5,
      });
      setShowAddDeptForm(false);
      setDeptSuccess("Department added successfully! ✓");

      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleEditDepartment = (dept) => {
    setEditingDeptId(dept.id);
    setEditDeptForm({
      id: dept.id,
      name: dept.name,
      shortName: dept.shortName,
      color: dept.color,
      semesters: dept.semesterCount || 8,
      years: dept.yearsCount || 5,
    });
    setShowEditForm(true);
    setDeptError("");
  };

  const handleSaveEditDepartment = (e) => {
    e.preventDefault();
    setDeptError("");
    setDeptSuccess("");

    if (!editDeptForm.name.trim()) {
      setDeptError("Department name is required");
      return;
    }
    if (!editDeptForm.shortName.trim()) {
      setDeptError("Short name is required");
      return;
    }

    try {
      // Update the department in memory
      const updatedDepts = allDepartments.map((dept) => {
        if (dept.id === editingDeptId) {
          return {
            ...dept,
            name: editDeptForm.name,
            shortName: editDeptForm.shortName.toUpperCase(),
            color: editDeptForm.color,
            semesterCount: parseInt(editDeptForm.semesters) || 8,
            yearsCount: parseInt(editDeptForm.years) || 5,
          };
        }
        return dept;
      });

      // Save to localStorage
      const serializeDepts = updatedDepts.map((dept) => ({
        ...dept,
        iconName: dept.icon?.name || "Monitor",
      }));

      localStorage.setItem(
        "aus_vault_departments",
        JSON.stringify(serializeDepts),
      );

      // Update local state
      setAllDepartments(updatedDepts);
      setEditingDeptId(null);
      setShowEditForm(false);
      setDeptSuccess("Department updated successfully! ✓");

      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingDeptId(null);
    setEditDeptForm({
      id: "",
      name: "",
      shortName: "",
      color: "#92bcea",
      semesters: 8,
      years: 5,
    });
    setDeptError("");
  };

  const handleApprove = (id) => {
    approveUpload(id);
    setActionFeedback({
      type: "approved",
      message: "Paper approved & published",
    });
    if (selectedIndex >= pending.length - 1)
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleReject = (id) => {
    rejectUpload(id);
    setActionFeedback({
      type: "rejected",
      message: "Paper rejected & removed",
    });
    if (selectedIndex >= pending.length - 1)
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getDeptName = (deptId) => {
    const deptList =
      allDepartments.length > 0 ? allDepartments : getDepartments();
    const dept = deptList.find((d) => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  const getDeptShort = (deptId) => {
    const deptList =
      allDepartments.length > 0 ? allDepartments : getDepartments();
    const dept = deptList.find((d) => d.id === deptId);
    return dept ? dept.shortName : deptId.toUpperCase();
  };

  // ───── AUTH GATE ─────
  if (!authenticated) {
    return (
      <div className="admin-auth-wrapper">
        <div className="admin-auth glass-card">
          <div className="admin-auth-header">
            <div className="admin-auth-badge">
              <Shield size={12} />
              Restricted Access
            </div>
            <div className="admin-auth-icon">
              <Lock />
            </div>
            <h1 className="admin-auth-title">SYS.ADMIN_REVIEW</h1>
            <p className="admin-auth-sub">
              Enter admin credentials to access the review panel
            </p>
          </div>
          <form className="admin-auth-form" onSubmit={handleLogin}>
            {/* Username Field */}
            <div className="admin-input-group">
              <div className="admin-input-label">
                <User size={11} />
                Username
              </div>
              <input
                type="text"
                className="input-cyber"
                placeholder="Enter admin username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                disabled={isLocked}
                id="admin-username"
                autoComplete="off"
              />
            </div>

            {/* Password Field */}
            <div className="admin-input-group">
              <div className="admin-input-label">
                <Lock size={11} />
                Password
              </div>
              <input
                type="password"
                className="input-cyber"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                id="admin-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className={`admin-auth-error ${isLocked ? "locked" : ""}`}>
                <AlertTriangle size={13} />
                {error}
              </div>
            )}

            {/* Lockout Timer */}
            {isLocked && (
              <div className="admin-auth-lockout">
                <div className="admin-auth-lockout-bar">
                  <div
                    className="admin-auth-lockout-fill"
                    style={{ width: `${(lockTimer / 30) * 100}%` }}
                  />
                </div>
                <span className="admin-auth-lockout-text">
                  Retry in {lockTimer}s
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn-cyber-solid"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={isLocked}
            >
              <Lock size={14} />
              {isLocked ? "System Locked" : "Authenticate"}
            </button>
          </form>

          <div className="admin-auth-footer">
            <AlertTriangle size={10} />
            Unauthorized access attempts are logged
          </div>
        </div>
      </div>
    );
  }

  // Refresh pending list after state changes
  const currentPending = getPendingUploads();
  const selected = currentPending[selectedIndex] || null;

  // Mock Analytics Data
  const trafficData = [
    { name: 'Mon', downloads: 120, uploads: 15 },
    { name: 'Tue', downloads: 180, uploads: 22 },
    { name: 'Wed', downloads: 250, uploads: 40 },
    { name: 'Thu', downloads: 210, uploads: 35 },
    { name: 'Fri', downloads: 190, uploads: 28 },
    { name: 'Sat', downloads: 90, uploads: 10 },
    { name: 'Sun', downloads: 110, uploads: 12 },
  ];

  const deptStats = allDepartments.map(dept => ({
    name: dept.shortName,
    papers: Math.floor(Math.random() * 200) + 50
  }));

  // ───── MAIN REVIEW INTERFACE ─────
  return (
    <div className="admin-review">
      {/* ═══ Top Bar ═══ */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/" className="admin-exit-btn">
            <ArrowLeft size={14} />
            Exit_Review
          </Link>
        </div>
        <span className="admin-topbar-title">SYS.ADMIN_REVIEW</span>
        <div className="admin-topbar-right">
          <div className="admin-user-badge">
            <User size={11} />
            {currentAdmin?.username} ({currentAdmin?.role})
          </div>
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={13} />
          </button>
          <div className="admin-node-status">
            <div className="admin-node-dot" />
            Node_Active
          </div>
        </div>
      </div>

      {/* ═══ Admin Tabs ═══ */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${adminTab === "review" ? "active" : ""}`}
          onClick={() => setAdminTab("review")}
        >
          <FileText size={14} />
          Review_Queue
        </button>
        <button
          className={`admin-tab-btn ${adminTab === "departments" ? "active" : ""}`}
          onClick={() => setAdminTab("departments")}
        >
          <Settings size={14} />
          Manage_Departments
        </button>
        <button
          className={`admin-tab-btn ${adminTab === "analytics" ? "active" : ""}`}
          onClick={() => setAdminTab("analytics")}
        >
          <BarChart3 size={14} />
          Vault_Analytics
        </button>
      </div>

      <div className="admin-body">
        {adminTab === "review" ? (
          <>
            {currentPending.length === 0 ? (
              // Empty state for review queue
              <div className="admin-empty-state">
                <div className="admin-empty-icon">
                  <CheckCircle2 />
                </div>
                <h2 className="admin-empty-title">Queue Clear</h2>
                <p className="admin-empty-sub">
                  No pending uploads to review. All caught up.
                </p>
              </div>
            ) : (
              // Review queue content
              <>
                {/* ═══ LEFT SIDEBAR ═══ */}
                <aside className="admin-sidebar">
                  {/* Stats */}
                  <div className="admin-sidebar-stats">
                    <div className="admin-sidebar-stat">
                      <div className="admin-sidebar-stat-label">
                        Pending_Reviews
                      </div>
                      <div className="admin-sidebar-stat-value pending">
                        {currentPending.length}
                      </div>
                    </div>
                    <div className="admin-sidebar-stat">
                      <div className="admin-sidebar-stat-label">
                        Approved_Today
                      </div>
                      <div className="admin-sidebar-stat-value approved">
                        {approvedToday}
                      </div>
                    </div>
                  </div>

                  {/* Queue Header */}
                  <div className="admin-queue-header">
                    <span className="admin-queue-title">Queue_Buffer</span>
                    <SlidersHorizontal size={14} className="admin-queue-icon" />
                  </div>

                  {/* Queue Items */}
                  <div className="admin-queue-list">
                    {currentPending.map((item, index) => (
                      <button
                        key={item.id}
                        className={`admin-queue-item ${selectedIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <div className="admin-queue-item-top">
                          <span className="admin-queue-item-id">
                            ID: {queueIdLabel(item.id)}
                          </span>
                          <span className="admin-queue-item-time">
                            {getTimeAgo(item.submittedAt ?? item.uploadedAt)}
                          </span>
                        </div>
                        <div className="admin-queue-item-subject">
                          {item.subject}
                        </div>
                        <div className="admin-queue-item-meta">
                          {getDeptShort(item.department)} • Sem {item.semester}{" "}
                          • {item.year}
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>

                {/* ═══ RIGHT MAIN AREA ═══ */}
                <div className="admin-main">
                  {selected ? (
                    <>
                      {/* Review Header */}
                      <div className="admin-review-header">
                        <div className="admin-review-header-left">
                          <div className="admin-review-target">
                            <span className="admin-review-target-dot" />
                            Active_Review_Target :: {queueIdLabel(selected.id)}
                          </div>
                          <h2 className="admin-review-subject">
                            {selected.subject}
                          </h2>
                          <div className="admin-review-tags">
                            <span className="admin-review-tag primary">
                              {getDeptShort(selected.department)}-
                              {selected.semester}0{selected.semester}
                            </span>
                            <span className="admin-review-tag">
                              {getDeptName(selected.department)}
                            </span>
                            <span className="admin-review-tag">
                              Semester_{selected.semester}
                            </span>
                            <span className="admin-review-tag">
                              {selected.year}
                            </span>
                          </div>
                        </div>
                        <div className="admin-review-header-right">
                          <div className="admin-review-meta-item">
                            <span className="admin-review-meta-label">
                              Uploaded_By
                            </span>
                            <span className="admin-review-meta-value">
                              {selected.uploaderName || "Anonymous"}
                            </span>
                          </div>
                          <div className="admin-review-meta-item">
                            <span className="admin-review-meta-label">
                              File_Size
                            </span>
                            <span className="admin-review-meta-value">
                              {selected.fileSize
                                ? `${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB`
                                : "—"}{" "}
                              (
                              {selected.fileName
                                ?.split(".")
                                .pop()
                                ?.toUpperCase() || "PDF"}
                              )
                            </span>
                          </div>
                          <div className="admin-review-meta-item">
                            <span className="admin-review-meta-label">
                              Reviewed_By
                            </span>
                            <span className="admin-review-meta-value admin-review-meta-reviewer">
                              {currentAdmin?.username}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Document Preview */}
                      <div className="admin-preview-area">
                        <div className="admin-preview-paper">
                          <div className="admin-preview-paper-header">
                            <div className="admin-preview-paper-dept">
                              {getDeptName(selected.department)}
                            </div>
                            <div className="admin-preview-paper-exam">
                              End Semester Examination — {selected.year}
                            </div>
                          </div>
                          <div className="admin-preview-paper-info">
                            <span>
                              Course: {getDeptShort(selected.department)}-
                              {selected.semester}0{selected.semester}
                            </span>
                            <span>Time: 3 Hours</span>
                          </div>
                          <div className="admin-preview-paper-question">
                            <strong>Q1.</strong> Explain the fundamental
                            concepts of {selected.subject} with suitable
                            examples. Discuss the significance of each concept
                            in the current academic context. (10 marks)
                          </div>
                          <div className="admin-preview-paper-question">
                            <strong>Q2.</strong> Analyze the key principles in{" "}
                            {selected.subject}. Under what conditions do these
                            principles apply? Provide a detailed comparison. (15
                            marks)
                          </div>
                          <div className="admin-preview-paper-question">
                            <strong>Q3.</strong> Write a detailed note on the
                            practical applications of topics covered in{" "}
                            {selected.subject}. Include diagrams where
                            applicable. (10 marks)
                          </div>
                          <div className="admin-preview-placeholder">
                            [ DOCUMENT_PREVIEW ::{" "}
                            {selected.fileName || "paper.pdf"} ]
                          </div>
                        </div>
                      </div>

                      {/* Action Feedback Toast */}
                      {actionFeedback && (
                        <div
                          style={{
                            position: "fixed",
                            bottom: "5rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "0.6rem 1.5rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            letterSpacing: "0.06em",
                            zIndex: 100,
                            background:
                              actionFeedback.type === "approved"
                                ? "rgba(74,222,128,0.15)"
                                : "rgba(248,113,113,0.15)",
                            border: `1px solid ${actionFeedback.type === "approved" ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
                            color:
                              actionFeedback.type === "approved"
                                ? "var(--color-vault-success)"
                                : "var(--color-vault-danger)",
                            boxShadow: `0 4px 24px ${actionFeedback.type === "approved" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                          }}
                          className="animate-slideUp"
                        >
                          {actionFeedback.message}
                        </div>
                      )}

                      {/* Bottom Action Bar */}
                      <div className="admin-action-bar">
                        <button
                          className="admin-flag-btn"
                          title="Flag an issue with this upload"
                        >
                          <Flag size={13} />
                          _Flag_Issue
                        </button>
                        <div className="admin-action-spacer" />
                        <button
                          className="admin-reject-btn"
                          onClick={() => handleReject(selected.id)}
                        >
                          <X size={15} />
                          Reject_File
                        </button>
                        <button
                          className="admin-approve-btn"
                          onClick={() => handleApprove(selected.id)}
                        >
                          <Upload size={15} />
                          Confirm_&_Upload
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="admin-no-selection">
                      <div className="admin-no-selection-icon">
                        <Eye size={28} />
                      </div>
                      <p>Select an item from the queue to review</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : adminTab === "departments" ? (
          /* ═══ DEPARTMENTS MANAGEMENT TAB ═══ */
          <div className="admin-departments-section">
            <div className="admin-departments-header">
              <h2 className="admin-departments-title">
                Department_Management_System
              </h2>
              <button
                className="admin-add-dept-btn"
                onClick={() => setShowAddDeptForm(!showAddDeptForm)}
              >
                <Plus size={14} />
                Add_New_Department
              </button>
            </div>

            {/* Add Department Form */}
            {showAddDeptForm && (
              <div className="admin-add-dept-form-container">
                <form
                  className="admin-add-dept-form"
                  onSubmit={handleAddDepartment}
                >
                  <div className="admin-form-group">
                    <label className="admin-form-label">Department ID</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g., mechanical, civil, petroleum"
                      value={newDeptForm.id}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, id: e.target.value })
                      }
                    />
                    <small className="admin-form-hint">
                      Unique identifier (lowercase, use hyphens for spaces)
                    </small>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g., Mechanical Engineering"
                      value={newDeptForm.name}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Short Name / Code
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g., ME, CIVIL, PETRO"
                      value={newDeptForm.shortName}
                      onChange={(e) =>
                        setNewDeptForm({
                          ...newDeptForm,
                          shortName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Color</label>
                    <div className="admin-color-picker">
                      <input
                        type="color"
                        className="admin-form-color"
                        value={newDeptForm.color}
                        onChange={(e) =>
                          setNewDeptForm({
                            ...newDeptForm,
                            color: e.target.value,
                          })
                        }
                      />
                      <span className="admin-color-value">
                        {newDeptForm.color}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Number of Semesters
                    </label>
                    <select
                      className="admin-form-input"
                      value={newDeptForm.semesters}
                      onChange={(e) =>
                        setNewDeptForm({
                          ...newDeptForm,
                          semesters: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 Semester</option>
                      <option value="2">2 Semesters</option>
                      <option value="3">3 Semesters</option>
                      <option value="4">4 Semesters</option>
                      <option value="5">5 Semesters</option>
                      <option value="6">6 Semesters</option>
                      <option value="7">7 Semesters</option>
                      <option value="8" selected>
                        8 Semesters
                      </option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Years of Question Papers
                    </label>
                    <select
                      className="admin-form-input"
                      value={newDeptForm.years}
                      onChange={(e) =>
                        setNewDeptForm({
                          ...newDeptForm,
                          years: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                      <option value="5" selected>
                        5 Years
                      </option>
                      <option value="6">6 Years</option>
                      <option value="7">7 Years</option>
                      <option value="10">10 Years</option>
                    </select>
                  </div>

                  {deptError && (
                    <div className="admin-form-error">
                      <AlertTriangle size={12} />
                      {deptError}
                    </div>
                  )}

                  {deptSuccess && (
                    <div className="admin-form-success">
                      <CheckCircle2 size={12} />
                      {deptSuccess}
                    </div>
                  )}

                  <div className="admin-form-actions">
                    <button type="submit" className="admin-form-submit">
                      <Upload size={13} />
                      Create_Department
                    </button>
                    <button
                      type="button"
                      className="admin-form-cancel"
                      onClick={() => {
                        setShowAddDeptForm(false);
                        setNewDeptForm({
                          id: "",
                          name: "",
                          shortName: "",
                          color: "#92bcea",
                          semesters: 8,
                          years: 5,
                        });
                        setDeptError("");
                      }}
                    >
                      <X size={13} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Department Form */}
            {showEditForm && (
              <div className="admin-add-dept-form-container">
                <form
                  className="admin-add-dept-form"
                  onSubmit={handleSaveEditDepartment}
                >
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Department ID (Read-only)
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editDeptForm.id}
                      disabled
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editDeptForm.name}
                      onChange={(e) =>
                        setEditDeptForm({
                          ...editDeptForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Short Name / Code
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editDeptForm.shortName}
                      onChange={(e) =>
                        setEditDeptForm({
                          ...editDeptForm,
                          shortName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Color</label>
                    <div className="admin-color-picker">
                      <input
                        type="color"
                        className="admin-form-color"
                        value={editDeptForm.color}
                        onChange={(e) =>
                          setEditDeptForm({
                            ...editDeptForm,
                            color: e.target.value,
                          })
                        }
                      />
                      <span className="admin-color-value">
                        {editDeptForm.color}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Number of Semesters
                    </label>
                    <select
                      className="admin-form-input"
                      value={editDeptForm.semesters}
                      onChange={(e) =>
                        setEditDeptForm({
                          ...editDeptForm,
                          semesters: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 Semester</option>
                      <option value="2">2 Semesters</option>
                      <option value="3">3 Semesters</option>
                      <option value="4">4 Semesters</option>
                      <option value="5">5 Semesters</option>
                      <option value="6">6 Semesters</option>
                      <option value="7">7 Semesters</option>
                      <option value="8">8 Semesters</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Years of Question Papers
                    </label>
                    <select
                      className="admin-form-input"
                      value={editDeptForm.years}
                      onChange={(e) =>
                        setEditDeptForm({
                          ...editDeptForm,
                          years: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                      <option value="5">5 Years</option>
                      <option value="6">6 Years</option>
                      <option value="7">7 Years</option>
                      <option value="10">10 Years</option>
                    </select>
                  </div>

                  {deptError && (
                    <div className="admin-form-error">
                      <AlertTriangle size={12} />
                      {deptError}
                    </div>
                  )}

                  {deptSuccess && (
                    <div className="admin-form-success">
                      <CheckCircle2 size={12} />
                      {deptSuccess}
                    </div>
                  )}

                  <div className="admin-form-actions">
                    <button type="submit" className="admin-form-submit">
                      <Upload size={13} />
                      Save_Changes
                    </button>
                    <button
                      type="button"
                      className="admin-form-cancel"
                      onClick={handleCancelEdit}
                    >
                      <X size={13} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Departments List */}
            <div className="admin-departments-list-container">
              <h3 className="admin-departments-list-title">
                Active_Departments ({allDepartments.length})
              </h3>
              <div className="admin-departments-grid">
                {allDepartments.map((dept) => (
                  <div key={dept.id} className="admin-dept-card">
                    <div
                      className="admin-dept-card-color"
                      style={{ backgroundColor: dept.color }}
                    />
                    <div className="admin-dept-card-content">
                      <h4 className="admin-dept-card-name">{dept.name}</h4>
                      <p className="admin-dept-card-code">{dept.shortName}</p>
                      <span className="admin-dept-card-id">[{dept.id}]</span>
                      <div className="admin-dept-card-meta">
                        <small>{dept.semesterCount || 8} Semesters</small>
                        <small>{dept.yearsCount || 5} Years</small>
                      </div>
                    </div>
                    <button
                      className="admin-dept-card-edit"
                      onClick={() => handleEditDepartment(dept)}
                      title="Edit department"
                    >
                      ✎
                    </button>
                  </div>
                ))}
              </div>
              {allDepartments.length === 0 && (
                <div className="admin-no-departments">
                  <p>No departments configured yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ═══ ANALYTICS TAB ═══ */
          <div className="admin-analytics-section animate-slideUp" style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <h2 className="admin-departments-title" style={{ marginBottom: '2rem' }}>
              Vault_Analytics <Activity size={18} style={{ display: 'inline', marginLeft: '0.5rem', color: 'var(--color-vault-lavender)' }} />
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2rem' }} className="admin-analytics-grid">
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-vault-steel)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DownloadCloud size={16} /> Weekly Traffic (Uploads vs Downloads)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#afb3f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#afb3f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff8080" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff8080" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#607b96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#607b96" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(22, 26, 34, 0.95)', border: '1px solid rgba(175, 179, 247, 0.2)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="downloads" stroke="#afb3f7" fillOpacity={1} fill="url(#colorDownloads)" />
                    <Area type="monotone" dataKey="uploads" stroke="#ff8080" fillOpacity={1} fill="url(#colorUploads)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-vault-steel)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} /> Repository Size by Department
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deptStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#607b96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#607b96" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(22, 26, 34, 0.95)', border: '1px solid rgba(175, 179, 247, 0.2)', borderRadius: '8px', color: '#fff' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="papers" fill="#92bcea" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
