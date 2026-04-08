import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  ArrowLeft,
  User,
  AlertTriangle,
  LogOut,
  FileText,
  Settings,
  BarChart3,
  Book,
} from "lucide-react";
import { getDepartments } from "../../data/departments";
import { getAllPapers } from "../../data/mockPapers";
import { useSemesters, useApprovedPapers } from "../../hooks/useDepartments";
import { apiFetch } from "../../api/api";
import "./AdminPanel.css";

// Import Tabs
import ReviewTab from "./tabs/ReviewTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import CatalogTab from "./tabs/CatalogTab";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [adminTab, setAdminTab] = useState("review"); // 'review' | 'departments' | 'analytics' | 'catalog'

  const [allDepartments, setAllDepartments] = useState(() => getDepartments());
  const semestersData = useSemesters();
  const approvedPapers = useApprovedPapers();

  // Combine mock papers with reactive approved papers
  const allPapers = useMemo(
    () => [
      ...getAllPapers().filter((p) => !approvedPapers.some((ap) => ap.id === p.id)),
      ...approvedPapers,
    ],
    [approvedPapers],
  );

  // ───── ROLE-BASED ACCESS CONTROL ─────
  const hasAccessToTab = (role, tabName) => {
    if (!role) return false;

    // Normalize role (remove spaces, convert to lowercase)
    const normalizedRole = role.toLowerCase().replace(/\s+/g, "_");

    const roleAccess = {
      super_admin: ["review", "departments", "analytics", "catalog"],
      moderator: ["review", "departments"],
      reviewer: ["review"],
    };

    const allowedTabs = roleAccess[normalizedRole] || [];
    return allowedTabs.includes(tabName);
  };

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

  // Redirect to Review Queue if current role doesn't have access to current tab
  useEffect(() => {
    if (
      authenticated &&
      currentAdmin &&
      adminTab &&
      !hasAccessToTab(currentAdmin.role, adminTab)
    ) {
      setAdminTab("review");
    }
  }, [authenticated, currentAdmin, adminTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const data = await apiFetch("/admin/auth", "POST", {
      body: {
        username,
        password,
      },
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
        setError(`ACCESS_DENIED — Invalid credentials (${3 - attempts} attempts remaining)`);
      }
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentAdmin(null);
    setUsername("");
    setPassword("");
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
            <p className="admin-auth-sub">Enter admin credentials to access the review panel</p>
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
                <span className="admin-auth-lockout-text">Retry in {lockTimer}s</span>
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
          <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
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
        {hasAccessToTab(currentAdmin?.role, "review") && (
          <button
            className={`admin-tab-btn ${adminTab === "review" ? "active" : ""}`}
            onClick={() => setAdminTab("review")}
          >
            <FileText size={14} />
            Review_Queue
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "departments") && (
          <button
            className={`admin-tab-btn ${adminTab === "departments" ? "active" : ""}`}
            onClick={() => setAdminTab("departments")}
          >
            <Settings size={14} />
            Manage_Departments
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "analytics") && (
          <button
            className={`admin-tab-btn ${adminTab === "analytics" ? "active" : ""}`}
            onClick={() => setAdminTab("analytics")}
          >
            <BarChart3 size={14} />
            Vault_Analytics
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "catalog") && (
          <button
            className={`admin-tab-btn ${adminTab === "catalog" ? "active" : ""}`}
            onClick={() => setAdminTab("catalog")}
          >
            <Book size={14} />
            Catalog_Management
          </button>
        )}
      </div>

      <div className="admin-body">
        {adminTab === "review" && (
          <ReviewTab currentAdmin={currentAdmin} allDepartments={allDepartments} />
        )}
        {adminTab === "departments" && (
          <DepartmentsTab
            allDepartments={allDepartments}
            setAllDepartments={setAllDepartments}
          />
        )}
        {adminTab === "analytics" && (
          <AnalyticsTab allDepartments={allDepartments} />
        )}
        {adminTab === "catalog" && (
          <CatalogTab
            allDepartments={allDepartments}
            setAllDepartments={setAllDepartments}
            semestersData={semestersData}
            approvedPapers={approvedPapers}
            allPapers={allPapers}
          />
        )}
      </div>
    </div>
  );
}
