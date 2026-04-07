import { useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Download, FolderOpen, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { YEARS } from "../../data/departments";
import { getAllPapers } from "../../data/mockPapers";
import "./PaperList.css";

export default function PaperList({
  departmentId,
  subject,
  semester,
  selectedYear: propSelectedYear,
}) {
  const [internalYear, setInternalYear] = useState(null);
  const [previewPaper, setPreviewPaper] = useState(null);

  // Use prop if provided, otherwise use internal state
  const selectedYear =
    propSelectedYear !== undefined ? propSelectedYear : internalYear;

  const allPapers = getAllPapers();
  const filtered = allPapers.filter(
    (p) =>
      p.department === departmentId &&
      p.subject === subject &&
      p.semester === semester &&
      (selectedYear ? p.year === selectedYear : true),
  );

  // Only show year tabs if selectedYear prop is not provided (for backward compatibility)
  const showYearTabs = propSelectedYear === undefined;

  return (
    <div className="paper-list">
      <div className="paper-list-header">
        <h3 className="paper-list-title">
          Question Papers {filtered.length > 0 && `(${filtered.length})`}
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

      {filtered.length === 0 ? (
        <div className="paper-empty">
          <div className="paper-empty-icon">
            <FolderOpen />
          </div>
          <p className="paper-empty-text">No papers found</p>
          <p className="paper-empty-sub">
            {selectedYear
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
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    className="paper-card-download"
                    title="Quick Look preview"
                    onClick={() => setPreviewPaper(paper)}
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                  <button
                    className="paper-card-download"
                    title="Download paper"
                  >
                    <Download size={12} />
                    Download
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
                <div className="preview-modal-header">
                  <h3>
                    {previewPaper.fileName || `${previewPaper.subject} Paper`}
                  </h3>
                  <button
                    className="preview-modal-close"
                    onClick={() => setPreviewPaper(null)}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="preview-modal-body">
                  {previewPaper.link && previewPaper.link !== "#" ? (
                    <iframe
                      src={previewPaper.link}
                      title="PDF Preview"
                      className="preview-iframe"
                    />
                  ) : (
                    <div className="mock-pdf-container">
                      <div className="mock-pdf-page">
                        <div className="mock-pdf-header">
                          <h2>Assam University, Silchar</h2>
                          <h3>
                            {departments.find(
                              (d) => d.id === previewPaper.department,
                            )?.name || previewPaper.department}
                          </h3>
                          <p>End Semester Examination - {previewPaper.year}</p>
                        </div>
                        <div className="mock-pdf-meta">
                          <span>Subject: {previewPaper.subject}</span>
                          <span>Semester: {previewPaper.semester}</span>
                          <span>Full Marks: 70</span>
                          <span>Time: 3 Hours</span>
                        </div>
                        <div className="mock-pdf-instructions">
                          <em>
                            The figures in the margin indicate full marks for
                            the questions.
                          </em>
                          <br />
                          <em>Answer any FIVE questions.</em>
                        </div>
                        <div className="mock-pdf-content">
                          <div className="mock-question">
                            <div className="q-num">1.</div>
                            <div className="q-text">
                              Explain the fundamental concepts of{" "}
                              {previewPaper.subject} with suitable examples.
                              Discuss the significance of each concept in the
                              current academic context.
                            </div>
                            <div className="q-marks">[14]</div>
                          </div>
                          <div className="mock-question">
                            <div className="q-num">2.</div>
                            <div className="q-text">
                              Analyze the key principles in{" "}
                              {previewPaper.subject}. Under what conditions do
                              these principles apply? Provide a detailed
                              comparison.
                            </div>
                            <div className="q-marks">[14]</div>
                          </div>
                          <div className="mock-question">
                            <div className="q-num">3.</div>
                            <div className="q-text">
                              Write a detailed note on the practical
                              applications of topics covered in{" "}
                              {previewPaper.subject}. Include diagrams where
                              applicable.
                            </div>
                            <div className="q-marks">[14]</div>
                          </div>
                          <div className="mock-question">
                            <div className="q-num">4.</div>
                            <div className="q-text">
                              Discuss the advanced derivations and theories
                              associated with {previewPaper.subject}.
                            </div>
                            <div className="q-marks">[14]</div>
                          </div>
                        </div>
                        <div className="mock-pdf-watermark">
                          AUS PAPER VAULT
                        </div>
                      </div>
                    </div>
                  )}
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
