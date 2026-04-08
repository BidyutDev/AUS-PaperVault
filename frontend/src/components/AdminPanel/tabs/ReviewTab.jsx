import { useState, useEffect } from "react";
import { SlidersHorizontal, CheckCircle2, Eye, Flag, X, Upload } from "lucide-react";
import { getPendingUploads, approveUpload, rejectUpload, getAllPapers, updatePendingUpload } from "../../../data/mockPapers";
import { getDepartments, getSubjectsForSemester, SEMESTERS } from "../../../data/departments";

/** Pending uploads use numeric ids (Date.now); coerce for display. */
function queueIdLabel(id) {
  return String(id).slice(0, 6).toUpperCase();
}

export default function ReviewTab({ currentAdmin, allDepartments }) {
  const [now, setNow] = useState(() => Date.now());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [editingUploadId, setEditingUploadId] = useState(null);
  const [editUploadData, setEditUploadData] = useState({
    department: "",
    subject: "",
    year: "",
    semester: "",
  });

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleUploadsUpdated = () => setNow(Date.now());
    window.addEventListener("uploadsUpdated", handleUploadsUpdated);
    return () => window.removeEventListener("uploadsUpdated", handleUploadsUpdated);
  }, []);

  const pending = getPendingUploads();
  const approvedToday = getAllPapers().length;
  const currentPending = getPendingUploads();
  const selected = currentPending[selectedIndex] || null;

  const saveEditChanges = (id) => {
    const changes = { ...editUploadData };
    if (changes.year) changes.year = parseInt(changes.year);
    if (changes.semester) changes.semester = parseInt(changes.semester);
    updatePendingUpload(id, changes);
    setEditingUploadId(null);
  };

  const handleApprove = (id) => {
    if (editingUploadId === id) {
      saveEditChanges(id);
    }
    approveUpload(id);
    window.dispatchEvent(new Event("papersUpdated"));
    setActionFeedback({
      type: "approved",
      message: "Paper approved & published",
    });
    if (selectedIndex >= pending.length - 1)
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleReject = (id) => {
    rejectUpload(id);
    setActionFeedback({
      type: "rejected",
      message: "Paper rejected & removed",
    });
    if (selectedIndex >= pending.length - 1)
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getDeptName = (deptId) => {
    const deptList = allDepartments.length > 0 ? allDepartments : getDepartments();
    const dept = deptList.find((d) => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  const getDeptShort = (deptId) => {
    const deptList = allDepartments.length > 0 ? allDepartments : getDepartments();
    const dept = deptList.find((d) => d.id === deptId);
    return dept ? dept.shortName : String(deptId).toUpperCase();
  };

  if (currentPending.length === 0) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-icon">
          <CheckCircle2 />
        </div>
        <h2 className="admin-empty-title">Queue Clear</h2>
        <p className="admin-empty-sub">
          No pending uploads to review. All caught up.
        </p>
      </div>
    );
  }

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-stats">
          <div className="admin-sidebar-stat">
            <div className="admin-sidebar-stat-label">Pending_Reviews</div>
            <div className="admin-sidebar-stat-value pending">
              {currentPending.length}
            </div>
          </div>
          <div className="admin-sidebar-stat">
            <div className="admin-sidebar-stat-label">Approved_Today</div>
            <div className="admin-sidebar-stat-value approved">
              {approvedToday}
            </div>
          </div>
        </div>

        <div className="admin-queue-header">
          <span className="admin-queue-title">Queue_Buffer</span>
          <SlidersHorizontal size={14} className="admin-queue-icon" />
        </div>

        <div className="admin-queue-list">
          {currentPending.map((item, index) => (
            <button
              key={item.id}
              className={`admin-queue-item ${selectedIndex === index ? "active" : ""}`}
              onClick={() => {
                if (editingUploadId && editingUploadId !== item.id) {
                  saveEditChanges(editingUploadId);
                }
                setSelectedIndex(index);
              }}
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

      <div className="admin-main">
        {selected ? (
          <>
            <div className="admin-review-header">
              <div className="admin-review-header-left">
                <div className="admin-review-target">
                  <span className="admin-review-target-dot" />
                  Active_Review_Target :: {queueIdLabel(selected.id)}
                </div>
                <h2 className="admin-review-subject">{selected.subject}</h2>
                <div className="admin-review-tags">
                  {editingUploadId === selected.id ? (
                    <>
                      <select
                        value={editUploadData.department || selected.department}
                        onChange={(e) =>
                          setEditUploadData({
                            ...editUploadData,
                            department: e.target.value,
                            subject: "",
                          })
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(175, 179, 247, 0.5)",
                          borderRadius: "0.25rem",
                          background: "rgba(0, 20, 40, 0.8)",
                          color: "var(--color-vault-light)",
                          minWidth: "120px",
                        }}
                      >
                        {allDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editUploadData.semester || selected.semester}
                        onChange={(e) =>
                          setEditUploadData({
                            ...editUploadData,
                            semester: e.target.value,
                            subject: "",
                          })
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(175, 179, 247, 0.5)",
                          borderRadius: "0.25rem",
                          background: "rgba(0, 20, 40, 0.8)",
                          color: "var(--color-vault-light)",
                          width: "100px",
                        }}
                      >
                        {SEMESTERS.map((sem) => (
                          <option key={sem} value={sem}>
                            Sem {sem}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editUploadData.subject || selected.subject}
                        onChange={(e) =>
                          setEditUploadData({
                            ...editUploadData,
                            subject: e.target.value,
                          })
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(175, 179, 247, 0.5)",
                          borderRadius: "0.25rem",
                          background: "rgba(0, 20, 40, 0.8)",
                          color: "var(--color-vault-light)",
                          flex: 1,
                          minWidth: "150px",
                        }}
                      >
                        <option value="">Select Subject</option>
                        {getSubjectsForSemester(
                          allDepartments.find(
                            (d) =>
                              d.id ===
                              (editUploadData.department || selected.department),
                          ),
                          parseInt(editUploadData.semester || selected.semester),
                        ).map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editUploadData.year || selected.year}
                        onChange={(e) =>
                          setEditUploadData({
                            ...editUploadData,
                            year: e.target.value,
                          })
                        }
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(175, 179, 247, 0.5)",
                          borderRadius: "0.25rem",
                          background: "rgba(0, 20, 40, 0.8)",
                          color: "var(--color-vault-light)",
                          width: "80px",
                        }}
                      />
                      <button
                        onClick={() => saveEditChanges(selected.id)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          background: "rgba(248, 113, 113, 0.2)",
                          border: "1px solid rgba(248, 113, 113, 0.5)",
                          color: "var(--color-vault-danger)",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                        }}
                      >
                        Close_Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="admin-review-tag primary">
                        {getDeptShort(selected.department)}-
                        {selected.semester}0{selected.semester}
                      </span>
                      <span className="admin-review-tag">
                        {getDeptName(selected.department)}
                      </span>
                      <span className="admin-review-tag">
                        Semester_{selected.semester}
                      </span>
                      <span className="admin-review-tag">{selected.year}</span>
                      <button
                        onClick={() => {
                          setEditingUploadId(selected.id);
                          setEditUploadData({
                            department: selected.department,
                            subject: selected.subject,
                            year: String(selected.year),
                            semester: String(selected.semester),
                          });
                        }}
                        style={{
                          padding: "0.3rem 0.8rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          background: "rgba(175, 179, 247, 0.15)",
                          border: "1px solid rgba(175, 179, 247, 0.4)",
                          color: "rgba(175, 179, 247, 0.9)",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(175, 179, 247, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(175, 179, 247, 0.15)";
                        }}
                        title="Edit paper details"
                      >
                        [EDIT_INFO]
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="admin-review-header-right">
                <div className="admin-review-meta-item">
                  <span className="admin-review-meta-label">Uploaded_By</span>
                  <span className="admin-review-meta-value">
                    {selected.uploaderName || "Anonymous"}
                  </span>
                </div>
                <div className="admin-review-meta-item">
                  <span className="admin-review-meta-label">File_Size</span>
                  <span className="admin-review-meta-value">
                    {selected.fileSize
                      ? `${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB`
                      : "—"}{" "}
                    ({selected.fileName?.split(".").pop()?.toUpperCase() || "PDF"})
                  </span>
                </div>
                <div className="admin-review-meta-item">
                  <span className="admin-review-meta-label">Reviewed_By</span>
                  <span className="admin-review-meta-value admin-review-meta-reviewer">
                    {currentAdmin?.username}
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-preview-area">
              <div className="admin-preview-paper">
                <div className="admin-preview-paper-header">
                  <div className="admin-preview-paper-dept">
                    {editingUploadId === selected.id
                      ? getDeptName(editUploadData.department || selected.department)
                      : getDeptName(selected.department)}
                  </div>
                  <div className="admin-preview-paper-exam">
                    End Semester Examination —{" "}
                    {editingUploadId === selected.id
                      ? editUploadData.year || selected.year
                      : selected.year}
                  </div>
                </div>
                <div className="admin-preview-paper-info">
                  <span>
                    Course:{" "}
                    {editingUploadId === selected.id
                      ? getDeptShort(editUploadData.department || selected.department)
                      : getDeptShort(selected.department)}
                    -
                    {editingUploadId === selected.id
                      ? editUploadData.semester || selected.semester
                      : selected.semester}
                    0
                    {editingUploadId === selected.id
                      ? editUploadData.semester || selected.semester
                      : selected.semester}
                  </span>
                  <span>Time: 3 Hours</span>
                </div>
                <div className="admin-preview-paper-question">
                  <strong>Q1.</strong> Explain the fundamental concepts of{" "}
                  {editingUploadId === selected.id
                    ? editUploadData.subject || selected.subject
                    : selected.subject}{" "}
                  with suitable examples. Discuss the significance of each concept in
                  the current academic context. (10 marks)
                </div>
                <div className="admin-preview-paper-question">
                  <strong>Q2.</strong> Analyze the key principles in{" "}
                  {editingUploadId === selected.id
                    ? editUploadData.subject || selected.subject
                    : selected.subject}
                  . Under what conditions do these principles apply? Provide a detailed
                  comparison. (15 marks)
                </div>
                <div className="admin-preview-paper-question">
                  <strong>Q3.</strong> Write a detailed note on the practical
                  applications of topics covered in{" "}
                  {editingUploadId === selected.id
                    ? editUploadData.subject || selected.subject
                    : selected.subject}
                  . Include diagrams where applicable. (10 marks)
                </div>
                <div className="admin-preview-placeholder">
                  [ DOCUMENT_PREVIEW :: {selected.fileName || "paper.pdf"} ]
                </div>
              </div>
            </div>

            {actionFeedback && (
              <div
                style={{
                  position: "fixed",
                  bottom: "5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "0.6rem 1.5rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  zIndex: 100,
                  background:
                    actionFeedback.type === "approved"
                      ? "rgba(74,222,128,0.15)"
                      : "rgba(248,113,113,0.15)",
                  border: `1px solid ${
                    actionFeedback.type === "approved"
                      ? "rgba(74,222,128,0.4)"
                      : "rgba(248,113,113,0.4)"
                  }`,
                  color:
                    actionFeedback.type === "approved"
                      ? "var(--color-vault-success)"
                      : "var(--color-vault-danger)",
                  boxShadow: `0 4px 24px ${
                    actionFeedback.type === "approved"
                      ? "rgba(74,222,128,0.2)"
                      : "rgba(248,113,113,0.2)"
                  }`,
                }}
                className="animate-slideUp"
              >
                {actionFeedback.message}
              </div>
            )}

            <div className="admin-action-bar">
              <button
                className="admin-flag-btn"
                title="Flag an issue with this upload"
              >
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
    </>
  );
}
