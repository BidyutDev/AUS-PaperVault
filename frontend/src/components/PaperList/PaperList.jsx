import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Download, FolderOpen, Eye, Bookmark, BookmarkCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { getDepartments, YEARS } from "../../data/departments";
import { useAllPapersWithLoading, useDepartments } from "../../hooks/useDepartments";
import { useBookmarks } from "../../hooks/useBookmarks";
import { useDownloads } from "../../hooks/useDownloads";
import Loader from "../Loader/Loader";
import fallbackPdf from "../AdminPanel/tabs/FEEDBACK.pdf";
import "./PaperList.css";

export default function PaperList({
  departmentId,
  subject,
  semester,
  selectedYear: propSelectedYear,
  papers: propPapers, // Optional: if provided, skips filtering (used by BookmarksPage)
}) {
  const [internalYear, setInternalYear] = useState(null);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const { papers: allPapers, loading: papersLoading } = useAllPapersWithLoading();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { getDownloadCount, incrementDownload } = useDownloads();

  const { departments } = useDepartments();
  const currentDept = departments.find(d => 
    d.id === departmentId || 
    d._id === departmentId || 
    d.shortName?.toLowerCase() === departmentId?.toLowerCase()
  );

  // Use prop if provided, otherwise use internal state
  const selectedYear =
    propSelectedYear !== undefined ? propSelectedYear : internalYear;

  const filtered = propPapers || allPapers.filter(
    (p) => {
      const matchDept = currentDept ? (
        p.department === currentDept.id || 
        p.department === currentDept.fullName || 
        p.department === currentDept.shortName || 
        p.department === currentDept._id
      ) : p.department === departmentId;

      return matchDept &&
        p.subject === subject &&
        String(p.semester) === String(semester) &&
        (selectedYear ? String(p.year) === String(selectedYear) : true);
    }
  );

  // Only show year tabs if selectedYear prop is not provided (for backward compatibility)
  const showYearTabs = propSelectedYear === undefined && !propPapers;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");

  const getPreviewUrl = (paper) => {
    if (!paper) return fallbackPdf;
    if (paper.path) {
      const normalizedPath = paper.path.replace(/\\/g, "/");
      const uploadsIndex = normalizedPath.indexOf("uploads");
      if (uploadsIndex !== -1) {
        const pathAfterUploads = normalizedPath.substring(uploadsIndex + 7);
        const formattedPath = pathAfterUploads.startsWith("/") ? pathAfterUploads : `/${pathAfterUploads}`;
        return `${BASE_URL}/uploads${formattedPath}`;
      }
      return `${BASE_URL}/${normalizedPath}`;
    }
    if (paper.link && paper.link !== "#") {
      return paper.link;
    }
    return fallbackPdf;
  };

  // Fetch PDF as blob to bypass ngrok interstitial page in iframes
  useEffect(() => {
    if (!previewPaper) {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
        setPreviewBlobUrl(null);
      }
      return;
    }

    let cancelled = false;
    const url = getPreviewUrl(previewPaper);
    if (!url || url === fallbackPdf) {
      setPreviewBlobUrl(fallbackPdf);
      return;
    }

    fetch(url, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        if (!cancelled) {
          const blobUrl = URL.createObjectURL(blob);
          setPreviewBlobUrl(blobUrl);
        }
      })
      .catch(() => {
        if (!cancelled) setPreviewBlobUrl(url); // fallback to direct URL
      });

    return () => {
      cancelled = true;
    };
  }, [previewPaper]);

  const handleDownload = async (paper) => {
    incrementDownload(paper.id);
    
    const url = getPreviewUrl(paper);
    if (url === fallbackPdf) {
      return;
    }

    try {
      // Fetch the file as a blob to force download instead of browser opening it
      const response = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = paper.fileName || `${paper.subject}_Paper.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading paper:", error);
      // Fallback: just try to open in a new tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className="paper-list">
      <div className="paper-list-header">
        <h3 className="paper-list-title">
          {propPapers ? "Saved Papers" : "Question Papers"} {filtered.length > 0 && `(${filtered.length})`}
        </h3>
        {showYearTabs && (
          <div className="year-tabs">
            <button
              className={`year-tab-all ${!internalYear ? "active" : ""}`}
              onClick={() => setInternalYear(null)}
            >
              All Years
            </button>
            {YEARS.map((year) => (
              <button
                key={year}
                className={`year-tab ${internalYear === year ? "active" : ""}`}
                onClick={() => setInternalYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {papersLoading && !propPapers ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
          <Loader text="Loading question papers..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="paper-empty">
          <div className="paper-empty-icon">
            <FolderOpen />
          </div>
          <p className="paper-empty-text">{propPapers ? "No saved papers" : "No papers found"}</p>
          <p className="paper-empty-sub">
            {propPapers 
              ? "Papers you save will appear here."
              : selectedYear
              ? `No papers available for ${selectedYear}. Try another year.`
              : "No papers uploaded for this combination yet."}
          </p>
        </div>
      ) : (
        <div className="paper-cards">
          {filtered.map((paper) => (
            <Tilt
              key={paper.id}
              glareEnable={true}
              glareMaxOpacity={0.2}
              glareColor="#afb3f7"
              glarePosition="all"
              scale={1.01}
              transitionSpeed={400}
              tiltMaxAngleX={3}
              tiltMaxAngleY={3}
              glareBorderRadius="8px"
              style={{ borderRadius: "8px" }}
            >
              <div className="paper-card">
                <div className="paper-card-icon">
                  <FileText />
                </div>
                <div className="paper-card-info">
                  <div className="paper-card-subject">{paper.subject}</div>
                  <div className="paper-card-meta">
                    <span className="paper-card-tag">
                      Year: <span>{paper.year}</span>
                    </span>
                    <span className="paper-card-tag">
                      Sem: <span>{paper.semester}</span>
                    </span>
                    <span className="paper-card-tag">{paper.fileName}</span>
                    {getDownloadCount(paper.id) > 0 && (
                      <span className="paper-card-tag" style={{ color: "var(--color-vault-lavender)" }}>
                        ↓ {getDownloadCount(paper.id)}
                      </span>
                    )}
                  </div>
                  <div className="paper-card-uploader">
                    <User size={12} />
                    <span>Uploaded by:</span> <span className="uploader-name">{paper.isAnonymous ? "Anonymous" : (paper.uploaderName || "Vault Admin")}</span>
                  </div>
                </div>
                <div className="paper-card-actions">
                  <button
                    className="paper-card-download"
                    title={isBookmarked(paper.id) ? "Remove bookmark" : "Save paper"}
                    onClick={() => toggleBookmark(paper.id)}
                    style={{ color: isBookmarked(paper.id) ? "var(--color-vault-lavender)" : "" }}
                  >
                    {isBookmarked(paper.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  </button>
                  <button
                    className="paper-card-download"
                    title="Quick Look preview"
                    onClick={async () => {
                      // On mobile, fetch PDF as blob and open in new tab (iframe doesn't work + ngrok blocks direct URLs)
                      const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
                      if (isMobile) {
                        const url = getPreviewUrl(paper);
                        if (url && url !== fallbackPdf) {
                          try {
                            const res = await fetch(url, {
                              headers: { "ngrok-skip-browser-warning": "true" },
                            });
                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, '_blank');
                          } catch {
                            window.open(url, '_blank');
                          }
                        }
                      } else {
                        setPreviewPaper(paper);
                      }
                    }}
                  >
                    <Eye size={14} />
                    <span className="paper-btn-label">Preview</span>
                  </button>
                  <button
                    className="paper-card-download"
                    title="Download paper"
                    onClick={() => handleDownload(paper)}
                  >
                    <Download size={14} />
                    <span className="paper-btn-label">Download</span>
                  </button>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      )}

      {/* ───── Quick Look Preview Modal ───── */}
      {createPortal(
        <AnimatePresence>
          {previewPaper && (
            <motion.div
              className="preview-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewPaper(null)}
            >
              <motion.div
                className="preview-modal-content"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="preview-modal-body">
                  {previewBlobUrl ? (
                    <iframe
                      src={previewBlobUrl}
                      title="PDF Preview"
                      className="preview-iframe"
                    />
                  ) : (
                    <div className="preview-loading">
                      <div className="preview-loading-spinner" />
                      <span className="preview-loading-text">Loading preview...</span>
                    </div>
                  )}
                  <div className="admin-preview-overlay-label">
                    [ DOCUMENT_PREVIEW :: {previewPaper.fileName || `${previewPaper.subject} Paper`} ]
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
