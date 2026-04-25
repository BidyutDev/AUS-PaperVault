import { useEffect, useState } from "react";
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
  MessageSquare,
  Users as UsersIcon,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getDepartments } from "../../data/departments";
import { useSemesters, useApprovedPapers, useAllPapers } from "../../hooks/useDepartments";
import "./AdminPanel.css";

// Import Tabs
import ReviewTab from "./tabs/ReviewTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import CatalogTab from "./tabs/CatalogTab";
import FeedbackTab from "./tabs/FeedbackTab";
import StaffTab from "./tabs/StaffTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AdminNotificationsBell from "./AdminNotificationsBell";

export default function AdminPanel() {
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [adminTab, setAdminTab] = useState("review"); // 'review' | 'departments' | 'analytics' | 'catalog'

  const currentAdmin = isLoggedIn && user.role != "Member" 
    ? user 
    : null;
    
  const authenticated = !!currentAdmin;

  const [allDepartments, setAllDepartments] = useState([]);
  useEffect(() => {
    const getDepts = async () => {
      try{
        const depts = await getDepartments();
        setAllDepartments(depts || [])
      }catch {
        setAllDepartments([])
      }
    }
    getDepts();
    
  },[])
  const semestersData = useSemesters();
  const approvedPapers = useApprovedPapers();
  const allPapers = useAllPapers();

  // ───── ROLE-BASED ACCESS CONTROL ─────
  const hasAccessToTab = (role, tabName) => {
    if (!role) return false;

    // Normalize role (remove spaces, convert to lowercase)
    const normalizedRole = role.toLowerCase().replace(/\s+/g, "_");

    const roleAccess = {
      super_admin: ["review", "departments", "analytics", "catalog", "feedback", "staff", "notifications"],
      moderator: ["review", "departments", "catalog", "feedback", "notifications"],
      reviewer: ["review"],
      member: [], // Members have zero access to admin panels
    };

    const allowedTabs = roleAccess[normalizedRole] || [];
    return allowedTabs.includes(tabName);
  };

  const handleLogout = () => {
    logout();
  };

  // ───── AUTH GATE ─────
  if (!authenticated) {
    return (
      <div className="admin-auth-wrapper">
        <div className="admin-auth glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <div className="admin-auth-icon" style={{ margin: "0 auto 1.5rem" }}>
            <Lock size={32} />
          </div>
          <h1 className="admin-auth-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>ACCESS DENIED</h1>
          <p className="admin-auth-sub" style={{ fontSize: "0.9rem", color: "var(--color-vault-steel)", marginBottom: "2rem" }}>
            {isLoggedIn 
              ? "Your current account does not have administrator privileges." 
              : "You must be logged in with an administrator account to access the control panel."}
          </p>
          <Link to="/" className="btn-cyber-solid" style={{ display: "inline-flex", justifyContent: "center", textDecoration: "none" }}>
            <ArrowLeft size={14} />
            Return to Home
          </Link>
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
            <span className="admin-exit-text">Exit_Panel</span>
          </Link>
        </div>
        <span className="admin-topbar-title">SYS.ADMIN_PANEL</span>
        <div className="admin-topbar-right">
          <AdminNotificationsBell
            currentAdmin={currentAdmin}
            hasAccessToTab={hasAccessToTab}
            setAdminTab={setAdminTab}
          />
          <button
            className="admin-notif-trigger"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div className="admin-user-badge">
            <User size={11} />
            <span className="admin-user-text">{currentAdmin?.username} ({currentAdmin?.role})</span>
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
        {hasAccessToTab(currentAdmin?.role, "catalog") && (
          <button
            className={`admin-tab-btn ${adminTab === "catalog" ? "active" : ""}`}
            onClick={() => setAdminTab("catalog")}
          >
            <Book size={14} />
            Catalog_Management
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "feedback") && (
          <button
            className={`admin-tab-btn ${adminTab === "feedback" ? "active" : ""}`}
            onClick={() => setAdminTab("feedback")}
          >
            <MessageSquare size={14} />
            User_Feedback
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "staff") && (
          <button
            className={`admin-tab-btn ${adminTab === "staff" ? "active" : ""}`}
            onClick={() => setAdminTab("staff")}
          >
            <UsersIcon size={14} />
            Staff_Management
          </button>
        )}
        {hasAccessToTab(currentAdmin?.role, "notifications") && (
          <button
            className={`admin-tab-btn ${adminTab === "notifications" ? "active" : ""}`}
            onClick={() => setAdminTab("notifications")}
          >
            <Bell size={14} />
            System_Broadcast
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
      </div>

      <div className="admin-body">
        {adminTab === "review" && (
          <ReviewTab currentAdmin={currentAdmin} allDepartments={allDepartments} semestersData={semestersData} />
        )}
        {adminTab === "departments" && (
          <DepartmentsTab
            allDepartments={allDepartments}
            setAllDepartments={setAllDepartments}
            currentAdmin={currentAdmin}
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
            currentAdmin={currentAdmin}
          />
        )}
        {adminTab === "feedback" && (
          <FeedbackTab currentAdmin={currentAdmin} />
        )}
        {adminTab === "staff" && (
          <StaffTab />
        )}
        {adminTab === "notifications" && (
          <NotificationsTab />
        )}
      </div>
    </div>
  );
}
