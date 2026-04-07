import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Building2, Home, Upload, Users, Menu, X } from 'lucide-react';
import departments from '../../data/departments';
import { getTotalPaperCount } from '../../data/mockPapers';
import './Header.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const totalPapers = getTotalPaperCount();
  const totalDepts = departments.length;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/upload', label: 'Upload', icon: Upload },
    { to: '/devs', label: 'Devs', icon: Users },
  ];

  return (
    <header className="header-wrapper">
      <div className="header">
        <div className="container-vault">
          <div className="header-inner">
            {/* Logo */}
            <Link to="/" className="header-logo" onClick={() => setMobileOpen(false)}>
              <div className="logo-icon-box">
                <FileText />
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
                  className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>

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
          <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
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
                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
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
