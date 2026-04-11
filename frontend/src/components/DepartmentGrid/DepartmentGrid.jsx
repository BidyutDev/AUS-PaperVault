import { ArrowRight, FileText, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { Link, useNavigate } from "react-router-dom";
import { useAllPapers, useDepartments } from "../../hooks/useDepartments";
import "./DepartmentGrid.css";

export default function DepartmentGrid() {
  const departments = useDepartments();
  const allPapers = useAllPapers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.shortName.toLowerCase().includes(q) ||
      dept.id.toLowerCase().includes(q)
    );
  });

  const showDropdown = isFocused && searchQuery.trim().length > 0;

  // Handle arrow keys + enter in dropdown
  const handleSearchKeyDown = useCallback(
    (e) => {
      if (!showDropdown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredDepartments.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredDepartments.length - 1,
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        const dept = filteredDepartments[highlightedIndex];
        if (dept) {
          navigate(`/department/${dept.id}`);
          setSearchQuery("");
          inputRef.current?.blur();
        }
      } else if (e.key === "Escape") {
        inputRef.current?.blur();
        setSearchQuery("");
      }
    },
    [showDropdown, filteredDepartments, highlightedIndex, navigate],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlight when query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className="dept-grid-section" id="departments">
      <div className="container-vault">
        {/* Section Header */}
        <div className="dept-grid-header">
          <div className="dept-grid-label">Select Department</div>
          <h2 className="dept-grid-title">Browse By Department</h2>
          <p className="dept-grid-subtitle">
            Choose your department to find question papers organized by subject,
            semester, and year.
          </p>
        </div>

        {/* ═══════ SEARCH BAR ═══════ */}
        <div className="dept-search-wrapper" ref={searchRef}>
          <div className={`dept-search-bar ${isFocused ? "focused" : ""}`}>
            <Search size={16} className="dept-search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="dept-search-input"
              placeholder="Search departments... (e.g. CSE, Physics)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleSearchKeyDown}
              id="department-search"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="dept-search-clear"
                onClick={clearSearch}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ═══════ SEARCH DROPDOWN ═══════ */}
          {showDropdown && (
            <div className="dept-search-dropdown animate-slideUp">
              {filteredDepartments.length > 0 ? (
                <>
                  <div className="dept-search-dropdown-label">
                    {filteredDepartments.length} department
                    {filteredDepartments.length !== 1 ? "s" : ""} found
                  </div>
                  {filteredDepartments.map((dept, index) => {
                    const Icon = dept.icon;
                    const paperCount = allPapers.filter(p => p.department === dept.id).length;
                    return (
                      <Link
                        to={`/department/${dept.id}`}
                        key={dept.id}
                        className={`dept-search-result ${highlightedIndex === index ? "highlighted" : ""}`}
                        onClick={() => {
                          setSearchQuery("");
                          setIsFocused(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        <div
                          className="dept-search-result-icon"
                          style={{ color: dept.color }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="dept-search-result-info">
                          <span className="dept-search-result-code">
                            {dept.shortName}
                          </span>
                          <span className="dept-search-result-name">
                            {dept.name}
                          </span>
                        </div>
                        <div className="dept-search-result-count">
                          <FileText size={11} />
                          <span>{paperCount}</span>
                        </div>
                        <ArrowRight
                          size={13}
                          className="dept-search-result-arrow"
                        />
                      </Link>
                    );
                  })}
                </>
              ) : (
                <div className="dept-search-empty">
                  <Search size={20} className="dept-search-empty-icon" />
                  <span className="dept-search-empty-text">
                    No departments matching &quot;{searchQuery}&quot;
                  </span>
                  <span className="dept-search-empty-hint">
                    Try CSE, Physics, English, Economics...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════ DEPARTMENT GRID ═══════ */}
        <div className="dept-grid">
          {filteredDepartments.map((dept, index) => {
            const Icon = dept.icon;
            const paperCount = allPapers.filter(p => p.department === dept.id).length;
            return (
              <Tilt
                key={dept.id}
                glareEnable={true}
                glareMaxOpacity={0.3}
                glareColor="#afb3f7"
                glarePosition="all"
                scale={1.02}
                transitionSpeed={400}
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareBorderRadius="12px"
                style={{ height: "100%", borderRadius: "12px" }} // Ensures the tilt container takes full height and has rounded corners
              >
                <Link
                  to={`/department/${dept.id}`}
                  className="dept-card animate-slideUp"
                  style={{
                    "--card-accent": dept.color,
                    animationDelay: `${index * 0.05}s`,
                    height: "100%", // Ensure link inside tilt takes full height
                  }}
                >
                  <div className="dept-card-icon" style={{ color: dept.color }}>
                    <Icon />
                  </div>
                  <div className="dept-card-short">{dept.shortName}</div>
                  <div className="dept-card-name">{dept.name}</div>
                  <div className="dept-card-meta">
                    <div className="dept-card-papers">
                      <FileText
                        size={12}
                        style={{
                          display: "inline",
                          marginRight: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                      <span>{paperCount}</span> papers
                    </div>
                    <ArrowRight size={14} className="dept-card-arrow" />
                  </div>
                </Link>
              </Tilt>
            );
          })}
        </div>

        {/* No results in grid */}
        {filteredDepartments.length === 0 && searchQuery && (
          <div className="dept-grid-no-results">
            <Search size={28} />
            <p>No departments found for &quot;{searchQuery}&quot;</p>
            <button className="btn-cyber" onClick={clearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
