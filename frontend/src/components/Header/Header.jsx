import {
  Building2,
  FileText,
  Home,
  LogOut,
  Menu,
  Upload,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTotalPaperCount } from "../../data/mockPapers";
import { useDepartments } from "../../hooks/useDepartments";
import "./Header.css";
import logoAus from "./logoAus.jpeg";

export default function Header() {
  const departments = useDepartments();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const totalPapers = getTotalPaperCount();
  const totalDepts = departments.length;

  const isActive = (path) => location.pathname === path;

  // Close user menu when route changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/devs", label: "Devs", icon: Users },
  ];

  return (
    <header className="header-wrapper">
      <div className="header">
        <div className="container-vault">
          <div className="header-inner">
            {/* Logo */}
            <Link
              to="/"
              className="header-logo"
              onClick={() => setMobileOpen(false)}
            >
              <div className="logo-icon-box">
                <img src={logoAus} alt="AUS PaperVault Logo" className="logo-image" />
              </div>
              <div className="logo-text">
                <span className="logo-main">
                  AUS <span className="logo-accent">PAPERVAULT</span>
                </span>
                <span className="logo-sub">Assam University // Silchar</span>
              </div>
            </Link>

            {/* Desktop Stats */}
            <div className="header-stats">
              <div className="stat-item">
                <FileText className="stat-icon" />
                <div>
                  <div className="stat-value">{totalPapers}</div>
                  <div className="stat-label">Papers</div>
                </div>
              </div>
              <div className="stat-item">
                <Building2 className="stat-icon" />
                <div>
                  <div className="stat-value">{totalDepts}</div>
                  <div className="stat-label">Departments</div>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="header-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive(link.to) ? "active" : ""}`}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Menu / Auth Buttons */}
            {user ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  className="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                  title={`Logged in as ${user.username}`}
                >
                  <UserIcon size={18} />
                  <span className="user-name">{user.username}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <UserIcon size={16} />
                      <div className="user-details">
                        <p className="user-email">{user.email}</p>
                        <p className="user-name-small">Logged in</p>
                      </div>
                    </div>
                    <hr className="dropdown-divider" />
                    <button
                      className="logout-btn"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="auth-btn login-btn"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="auth-btn signup-btn"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
            <div className="mobile-stats">
              <div className="stat-item" style={{ flex: 1 }}>
                <FileText className="stat-icon" />
                <div>
                  <div className="stat-value">{totalPapers}</div>
                  <div className="stat-label">Papers</div>
                </div>
              </div>
              <div className="stat-item" style={{ flex: 1 }}>
                <Building2 className="stat-icon" />
                <div>
                  <div className="stat-value">{totalDepts}</div>
                  <div className="stat-label">Depts</div>
                </div>
              </div>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
