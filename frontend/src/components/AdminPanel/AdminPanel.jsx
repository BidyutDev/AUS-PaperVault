import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, ArrowLeft, SlidersHorizontal, Flag,
  X, Upload, Eye, CheckCircle2, FileText
} from 'lucide-react';
import departments from '../../data/departments';
import { getPendingUploads, approveUpload, rejectUpload, getAllPapers } from '../../data/mockPapers';
import './AdminPanel.css';

const ADMIN_PASSWORD = 'ausvault2024';

/** Pending uploads use numeric ids (Date.now); coerce for display. */
function queueIdLabel(id) {
  return String(id).slice(0, 6).toUpperCase();
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const pending = getPendingUploads();
  const approvedToday = getAllPapers().length; // simplified count

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('ACCESS_DENIED — Invalid credentials');
    }
  };

  const handleApprove = (id) => {
    approveUpload(id);
    setActionFeedback({ type: 'approved', message: 'Paper approved & published' });
    if (selectedIndex >= pending.length - 1) setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleReject = (id) => {
    rejectUpload(id);
    setActionFeedback({ type: 'rejected', message: 'Paper rejected & removed' });
    if (selectedIndex >= pending.length - 1) setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'just now';
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getDeptName = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  const getDeptShort = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.shortName : deptId.toUpperCase();
  };

  // ───── AUTH GATE ─────
  if (!authenticated) {
    return (
      <div className="admin-auth-wrapper">
        <div className="admin-auth glass-card">
          <div className="admin-auth-header">
            <div className="admin-auth-badge">
              <Shield size={12} />
              Restricted Access
            </div>
            <div className="admin-auth-icon">
              <Lock />
            </div>
            <h1 className="admin-auth-title">SYS.ADMIN_REVIEW</h1>
            <p className="admin-auth-sub">Authenticate to access the review panel</p>
          </div>
          <form className="admin-auth-form" onSubmit={handleLogin}>
            <input
              type="password"
              className="input-cyber"
              placeholder="Enter admin password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="admin-auth-error">{error}</div>}
            <button type="submit" className="btn-cyber-solid" style={{ width: '100%', justifyContent: 'center' }}>
              <Lock size={14} />
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Refresh pending list after state changes
  const currentPending = getPendingUploads();
  const selected = currentPending[selectedIndex] || null;

  // ───── EMPTY STATE ─────
  if (currentPending.length === 0) {
    return (
      <div className="admin-review">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <Link to="/" className="admin-exit-btn">
              <ArrowLeft size={14} />
              Exit_Review
            </Link>
          </div>
          <span className="admin-topbar-title">SYS.ADMIN_REVIEW</span>
          <div className="admin-topbar-right">
            <div className="admin-node-status">
              <div className="admin-node-dot" />
              Node_Active
            </div>
          </div>
        </div>

        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <CheckCircle2 />
          </div>
          <h2 className="admin-empty-title">Queue Clear</h2>
          <p className="admin-empty-sub">No pending uploads to review. All caught up.</p>
        </div>
      </div>
    );
  }

  // ───── MAIN REVIEW INTERFACE ─────
  return (
    <div className="admin-review">
      {/* ═══ Top Bar ═══ */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/" className="admin-exit-btn">
            <ArrowLeft size={14} />
            Exit_Review
          </Link>
        </div>
        <span className="admin-topbar-title">SYS.ADMIN_REVIEW</span>
        <div className="admin-topbar-right">
          <div className="admin-node-status">
            <div className="admin-node-dot" />
            Node_Active
          </div>
        </div>
      </div>

      <div className="admin-body">
        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className="admin-sidebar">
          {/* Stats */}
          <div className="admin-sidebar-stats">
            <div className="admin-sidebar-stat">
              <div className="admin-sidebar-stat-label">Pending_Reviews</div>
              <div className="admin-sidebar-stat-value pending">{currentPending.length}</div>
            </div>
            <div className="admin-sidebar-stat">
              <div className="admin-sidebar-stat-label">Approved_Today</div>
              <div className="admin-sidebar-stat-value approved">{approvedToday}</div>
            </div>
          </div>

          {/* Queue Header */}
          <div className="admin-queue-header">
            <span className="admin-queue-title">Queue_Buffer</span>
            <SlidersHorizontal size={14} className="admin-queue-icon" />
          </div>

          {/* Queue Items */}
          <div className="admin-queue-list">
            {currentPending.map((item, index) => (
              <button
                key={item.id}
                className={`admin-queue-item ${selectedIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="admin-queue-item-top">
                  <span className="admin-queue-item-id">
                    ID: {queueIdLabel(item.id)}
                  </span>
                  <span className="admin-queue-item-time">
                    {getTimeAgo(item.submittedAt ?? item.uploadedAt)}
                  </span>
                </div>
                <div className="admin-queue-item-subject">{item.subject}</div>
                <div className="admin-queue-item-meta">
                  {getDeptShort(item.department)} • Sem {item.semester} • {item.year}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ═══ RIGHT MAIN AREA ═══ */}
        <div className="admin-main">
          {selected ? (
            <>
              {/* Review Header */}
              <div className="admin-review-header">
                <div className="admin-review-header-left">
                  <div className="admin-review-target">
                    <span className="admin-review-target-dot" />
                    Active_Review_Target :: {queueIdLabel(selected.id)}
                  </div>
                  <h2 className="admin-review-subject">{selected.subject}</h2>
                  <div className="admin-review-tags">
                    <span className="admin-review-tag primary">
                      {getDeptShort(selected.department)}-{selected.semester}0{selected.semester}
                    </span>
                    <span className="admin-review-tag">{getDeptName(selected.department)}</span>
                    <span className="admin-review-tag">Semester_{selected.semester}</span>
                    <span className="admin-review-tag">{selected.year}</span>
                  </div>
                </div>
                <div className="admin-review-header-right">
                  <div className="admin-review-meta-item">
                    <span className="admin-review-meta-label">Uploaded_By</span>
                    <span className="admin-review-meta-value">
                      {selected.uploaderName || 'Anonymous'}
                    </span>
                  </div>
                  <div className="admin-review-meta-item">
                    <span className="admin-review-meta-label">File_Size</span>
                    <span className="admin-review-meta-value">
                      {selected.fileSize
                        ? `${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB`
                        : '—'} ({selected.fileName?.split('.').pop()?.toUpperCase() || 'PDF'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="admin-preview-area">
                <div className="admin-preview-paper">
                  <div className="admin-preview-paper-header">
                    <div className="admin-preview-paper-dept">
                      {getDeptName(selected.department)}
                    </div>
                    <div className="admin-preview-paper-exam">
                      End Semester Examination — {selected.year}
                    </div>
                  </div>
                  <div className="admin-preview-paper-info">
                    <span>Course: {getDeptShort(selected.department)}-{selected.semester}0{selected.semester}</span>
                    <span>Time: 3 Hours</span>
                  </div>
                  <div className="admin-preview-paper-question">
                    <strong>Q1.</strong> Explain the fundamental concepts of {selected.subject} with
                    suitable examples. Discuss the significance of each concept in the current
                    academic context. (10 marks)
                  </div>
                  <div className="admin-preview-paper-question">
                    <strong>Q2.</strong> Analyze the key principles in {selected.subject}. Under what
                    conditions do these principles apply? Provide a detailed comparison. (15 marks)
                  </div>
                  <div className="admin-preview-paper-question">
                    <strong>Q3.</strong> Write a detailed note on the practical applications of
                    topics covered in {selected.subject}. Include diagrams where applicable. (10 marks)
                  </div>
                  <div className="admin-preview-placeholder">
                    [ DOCUMENT_PREVIEW :: {selected.fileName || 'paper.pdf'} ]
                  </div>
                </div>
              </div>

              {/* Action Feedback Toast */}
              {actionFeedback && (
                <div
                  style={{
                    position: 'fixed',
                    bottom: '5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0.6rem 1.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    zIndex: 100,
                    background: actionFeedback.type === 'approved' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                    border: `1px solid ${actionFeedback.type === 'approved' ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
                    color: actionFeedback.type === 'approved' ? 'var(--color-vault-success)' : 'var(--color-vault-danger)',
                    boxShadow: `0 4px 24px ${actionFeedback.type === 'approved' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  }}
                  className="animate-slideUp"
                >
                  {actionFeedback.message}
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="admin-action-bar">
                <button className="admin-flag-btn" title="Flag an issue with this upload">
                  <Flag size={13} />
                  _Flag_Issue
                </button>
                <div className="admin-action-spacer" />
                <button
                  className="admin-reject-btn"
                  onClick={() => handleReject(selected.id)}
                >
                  <X size={15} />
                  Reject_File
                </button>
                <button
                  className="admin-approve-btn"
                  onClick={() => handleApprove(selected.id)}
                >
                  <Upload size={15} />
                  Confirm_&_Upload
                </button>
              </div>
            </>
          ) : (
            <div className="admin-no-selection">
              <div className="admin-no-selection-icon">
                <Eye size={28} />
              </div>
              <p>Select an item from the queue to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
