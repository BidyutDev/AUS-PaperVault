import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Building2, ArrowRight, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { getDepartments } from "../../data/departments";
import { getAllPapers } from "../../data/mockPapers";
import "./SearchModal.css";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Build search indices
  const { fuseDepts, fusePapers } = useMemo(() => {
    const departments = getDepartments();
    const papers = getAllPapers();

    const fuseDepts = new Fuse(departments, {
      keys: ["name", "shortName", "id"],
      threshold: 0.35,
    });

    const fusePapers = new Fuse(papers, {
      keys: ["subject", "fileName", "department"],
      threshold: 0.35,
    });

    return { fuseDepts, fusePapers };
  }, [isOpen]); // Rebuild when opening so it catches new papers

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return { departments: [], papers: [] };

    const deptResults = fuseDepts.search(query, { limit: 4 }).map((r) => r.item);
    const paperResults = fusePapers.search(query, { limit: 6 }).map((r) => r.item);

    return { departments: deptResults, papers: paperResults };
  }, [query, fuseDepts, fusePapers]);

  const allResults = [...results.departments, ...results.papers];
  const totalResults = allResults.length;

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFocusIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((prev) => Math.min(prev + 1, totalResults - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && totalResults > 0) {
        e.preventDefault();
        handleSelect(allResults[focusIndex], focusIndex < results.departments.length ? "dept" : "paper");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusIndex, totalResults, allResults]);

  // Scroll focused item into view
  useEffect(() => {
    const focused = resultsRef.current?.querySelector(".focused");
    if (focused) {
      focused.scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex]);

  const handleSelect = (item, type) => {
    onClose();
    if (type === "dept") {
      navigate(`/department/${item.id}`);
    } else {
      navigate(`/department/${item.department}`);
    }
  };

  // Global ⌘K listener is handled in the parent (Header)

  if (!isOpen) return null;

  let idx = 0;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="search-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      >
        <motion.div
          className="search-modal"
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}
          <div className="search-input-area">
            <Search size={18} />
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search papers, departments, subjects..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFocusIndex(0);
              }}
              autoComplete="off"
            />
            <span className="search-kbd" onClick={onClose} style={{ cursor: "pointer" }}>
              ESC
            </span>
          </div>

          {/* Results */}
          <div className="search-results" ref={resultsRef}>
            {!query.trim() ? (
              <div className="search-empty">
                <Search size={32} />
                <p className="search-empty-text">Type to search across everything</p>
                <p className="search-empty-hint">Departments, subjects, papers...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="search-empty">
                <FolderOpen size={32} />
                <p className="search-empty-text">No results for "{query}"</p>
                <p className="search-empty-hint">Try a different keyword</p>
              </div>
            ) : (
              <>
                {results.departments.length > 0 && (
                  <>
                    <div className="search-group-label">Departments</div>
                    {results.departments.map((dept) => {
                      const currentIdx = idx++;
                      return (
                        <div
                          key={`dept-${dept.id}`}
                          className={`search-result-item ${currentIdx === focusIndex ? "focused" : ""}`}
                          onClick={() => handleSelect(dept, "dept")}
                          onMouseEnter={() => setFocusIndex(currentIdx)}
                        >
                          <div className="search-result-icon">
                            <Building2 size={16} />
                          </div>
                          <div className="search-result-info">
                            <div className="search-result-title">{dept.name}</div>
                            <div className="search-result-meta">{dept.shortName}</div>
                          </div>
                          <ArrowRight size={14} className="search-result-arrow" />
                        </div>
                      );
                    })}
                  </>
                )}

                {results.papers.length > 0 && (
                  <>
                    <div className="search-group-label">Papers</div>
                    {results.papers.map((paper) => {
                      const currentIdx = idx++;
                      const deptName = getDepartments().find((d) => d.id === paper.department)?.name || paper.department;
                      return (
                        <div
                          key={`paper-${paper.id}`}
                          className={`search-result-item ${currentIdx === focusIndex ? "focused" : ""}`}
                          onClick={() => handleSelect(paper, "paper")}
                          onMouseEnter={() => setFocusIndex(currentIdx)}
                        >
                          <div className="search-result-icon">
                            <FileText size={16} />
                          </div>
                          <div className="search-result-info">
                            <div className="search-result-title">{paper.subject}</div>
                            <div className="search-result-meta">
                              {deptName} · Sem {paper.semester} · {paper.year}
                            </div>
                          </div>
                          <ArrowRight size={14} className="search-result-arrow" />
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="search-footer">
            <span className="search-footer-hint">
              <span className="search-kbd">↑↓</span> Navigate
            </span>
            <span className="search-footer-hint">
              <span className="search-kbd">↵</span> Open
            </span>
            <span className="search-footer-hint">
              <span className="search-kbd">ESC</span> Close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
