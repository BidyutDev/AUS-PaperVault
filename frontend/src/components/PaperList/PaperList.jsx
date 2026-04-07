import { useState } from 'react';
import { FileText, Download, FolderOpen, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { YEARS } from '../../data/departments';
import { getAllPapers } from '../../data/mockPapers';
import './PaperList.css';

export default function PaperList({ departmentId, subject, semester }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [previewPaper, setPreviewPaper] = useState(null);

  const allPapers = getAllPapers();
  const filtered = allPapers.filter(
    (p) =>
      p.department === departmentId &&
      p.subject === subject &&
      p.semester === semester &&
      (selectedYear ? p.year === selectedYear : true)
  );

  return (
    <div className="paper-list">
      <div className="paper-list-header">
        <h3 className="paper-list-title">
          Question Papers {filtered.length > 0 && `(${filtered.length})`}
        </h3>
        <div className="year-tabs">
          <button
            className={`year-tab-all ${!selectedYear ? 'active' : ''}`}
            onClick={() => setSelectedYear(null)}
          >
            All Years
          </button>
          {YEARS.map((year) => (
            <button
              key={year}
              className={`year-tab ${selectedYear === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
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
              : 'No papers uploaded for this combination yet.'}
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
                    <span className="paper-card-tag">
                      {paper.fileName}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    className="paper-card-download" 
                    title="Quick Look preview"
                    onClick={() => setPreviewPaper(paper)}
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                  <button className="paper-card-download" title="Download paper">
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
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preview-modal-header">
                <h3>{previewPaper.fileName || `${previewPaper.subject} Paper`}</h3>
                <button
                  className="preview-modal-close"
                  onClick={() => setPreviewPaper(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="preview-modal-body">
                <iframe
                  src={previewPaper.link || '#'}
                  title="PDF Preview"
                  className="preview-iframe"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
