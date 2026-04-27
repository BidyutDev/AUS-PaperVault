import { useState, useEffect } from "react";
import { queueIdLabel, getDeptName, getDeptShort } from "./reviewUtils";
import { Pencil, Check, X, Loader2 } from "lucide-react";


export default function ReviewHeader({ selected, currentAdmin, allDepartments, onUpdateTags }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ department: "", semester: "", year: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setEditData({
        department: selected.department || "",
        semester: selected.semester || "",
        year: selected.year || "",
      });
      setIsEditing(false);
    }
  }, [selected]);

  const handleSave = async () => {
    if (!onUpdateTags) return;
    setIsSaving(true);
    await onUpdateTags(selected._id, editData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      department: selected.department || "",
      semester: selected.semester || "",
      year: selected.year || "",
    });
    setIsEditing(false);
  };
  return (
    <div className="admin-review-header">
      <div className="admin-review-header-left">
        <div className="admin-review-target">
          <span className="admin-review-target-dot" />
          Active_Review_Target :: {queueIdLabel(selected._id)}
        </div>
        <h2 className="admin-review-subject">
          {selected.subject || "Untitled"}
        </h2>
        <div className="admin-review-tags">
          {isEditing ? (
            <div className="admin-review-tags-edit-form">
              <select
                className="admin-review-edit-input"
                value={editData.department}
                onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              >
                {allDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                className="admin-review-edit-input"
                value={editData.semester}
                onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>Semester {sem}</option>
                ))}
              </select>
              <input
                type="number"
                className="admin-review-edit-input"
                value={editData.year}
                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              />
              <button
                className="admin-review-edit-btn save"
                onClick={handleSave}
                disabled={isSaving}
                title="Save Tags"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              </button>
              <button
                className="admin-review-edit-btn cancel"
                onClick={handleCancel}
                disabled={isSaving}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <span className="admin-review-tag primary">
                {getDeptShort(selected.department, allDepartments)}-
                {selected.semester}0{selected.semester}
              </span>
              <span className="admin-review-tag">
                {getDeptName(selected.department, allDepartments)}
              </span>
              <span className="admin-review-tag">
                Semester_{selected.semester}
              </span>
              <span className="admin-review-tag">{selected.year}</span>
              <button 
                className="admin-review-edit-icon-btn" 
                onClick={() => setIsEditing(true)}
                title="Edit Tags"
              >
                <Pencil size={14} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="admin-review-header-right">
        <div className="admin-review-meta-item">
          <span className="admin-review-meta-label">Uploaded_By</span>
          <span className="admin-review-meta-value">
            {selected.isAnonymous ? "Anonymous" : 
              (selected.uploadedBy 
                ? (typeof selected.uploadedBy === 'object' 
                    ? (selected.uploadedBy.username || `${selected.uploadedBy.firstName || ''} ${selected.uploadedBy.lastName || ''}`.trim())
                    : selected.uploadedBy) 
                : "Anonymous")}
          </span>
        </div>
        <div className="admin-review-meta-item">
          <span className="admin-review-meta-label">File_Size</span>
          <span className="admin-review-meta-value">
            {selected.fileSize
              ? `${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB`
              : "—"}{" "}
            ({selected.mimeType?.split("/").pop()?.toUpperCase() || "PDF"})
          </span>
        </div>
        <div className="admin-review-meta-item">
          <span className="admin-review-meta-label">Original_File</span>
          <span className="admin-review-meta-value">
            {selected.originalName || selected.fileName || "—"}
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
  );
}
