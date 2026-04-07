import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-vault">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FileText />
              </div>
              <div className="footer-logo-text">
                AUS <span>PAPERVAULT</span>
              </div>
            </div>
            <p className="footer-desc">
              A community-driven question paper repository for Assam University,
              Silchar. Browse, download, and contribute papers to help fellow students.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links-group">
            <div className="footer-links-col">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/upload">Upload Paper</Link></li>
                <li><Link to="/devs">Developers</Link></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>University</h4>
              <ul>
                <li><a href="https://aus.ac.in" target="_blank" rel="noopener noreferrer">AUS Official</a></li>
                <li><a href="#departments">Departments</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Results Portal</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Exam Schedule</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} <span>AUS PaperVault</span>. All rights reserved.
          </p>
          <p className="footer-motto">Built by students // For students</p>
        </div>
      </div>
    </footer>
  );
}
