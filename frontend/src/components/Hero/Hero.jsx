import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  const scrollToDepartments = (e) => {
    e.preventDefault();
    const el = document.getElementById("departments");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-section">
      {/* Background Effects */}
      <div className="hero-bg">
        <div className="hero-grid-lines" />
        <div className="hero-gradient" />
        <div className="hero-scanline" />
        <div className="hero-vignette" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="container-vault">
        <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
          {/* Left Content */}
          <div className="hero-content" style={{ flex: 1 }}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Assam University // Question Paper Archive
            </div>

            <h1 className="hero-title">
              Access Previous Year{" "}
              <span className="hero-title-accent">Question Papers</span>
            </h1>

            <p className="hero-subtitle">
              Browse, search, and download question papers from all departments
              of Assam University, Silchar. Contribute by uploading papers you
              have.
            </p>

            <div className="hero-actions">
              <button onClick={scrollToDepartments} className="btn-cyber-solid">
                <Search size={16} />
                Browse Departments
              </button>
              <Link to="/upload" className="btn-cyber">
                <ArrowRight size={16} />
                Upload Paper
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hero-visual" style={{ flex: "0 0 320px" }}>
            <div className="hero-card-stack">
              <div className="hero-float-card">
                <div className="hero-float-card-label">CSE // Semester 5</div>
                <div className="hero-float-card-title">
                  Computer Networks — 2024
                </div>
                <div className="hero-float-card-bar" />
                <div className="hero-float-card-bar short" />
              </div>
              <div className="hero-float-card">
                <div className="hero-float-card-label">
                  Physics // Semester 3
                </div>
                <div className="hero-float-card-title">
                  Quantum Mechanics — 2023
                </div>
                <div className="hero-float-card-bar" />
                <div className="hero-float-card-bar short" />
              </div>
              <div className="hero-float-card">
                <div className="hero-float-card-label">ECE // Semester 4</div>
                <div className="hero-float-card-title">
                  Signal Processing — 2024
                </div>
                <div className="hero-float-card-bar" />
                <div className="hero-float-card-bar short" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
