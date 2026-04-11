import {
  Bookmark,
  Building2,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Shield,
  Sun,
  Upload,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getTotalPaperCount } from "../../data/mockPapers";
import { useDepartments } from "../../hooks/useDepartments";
import SearchModal from "../SearchModal/SearchModal";
import "./Header.css";
import logoAus from "./aus-logo.png";

export default function Header() {
  const departments = useDepartments();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/devs", label: "Devs", icon: Users },
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
    { to: "/bookmarks", label: "Saved", icon: Bookmark },
  ];

  if (user && user.role !== "Member") {
    navLinks.push({ to: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <motion.header
      className="header-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'linear' }}
    >
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <div className="header">
        <div className="header-fullpage-inner">
          <div className="header-inner">
            {/* ── Left: Logo + Stats ── */}
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
                  <div className="stat-label">Depts</div>
                </div>
              </div>
            </div>

            {/* ── Center: Nav (pushes right via margin-left:auto) ── */}
            <nav className="header-nav" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive(link.to) ? "active" : ""}`}
                >
                  <link.icon size={13} />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right: Search + Theme + User ── */}
            <div className="header-right">
              {/* Search Trigger */}
              <button
                className="search-trigger"
                style={{ gap: "1rem"}}
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search size={14} />
                <span>⌘+K</span>
              </button>

              {/* Theme Toggle */}
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`${theme === "dark" ? "Light" : "Dark"} mode`}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {user ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button
                    className="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                    title={`Logged in as ${user.username}`}
                  >
                    <UserIcon size={16} />
                    <span className="user-name">{user.username}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <UserIcon size={16} />
                        <div className="user-details">
                          <p className="user-email">{user.email}</p>
                          <p className="user-role">({user.role})</p>
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
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
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

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
}
