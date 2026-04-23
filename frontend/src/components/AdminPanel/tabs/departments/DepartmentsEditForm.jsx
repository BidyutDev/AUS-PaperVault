import { AlertTriangle, CheckCircle2, Upload, X } from "lucide-react";

export default function DepartmentsEditForm({
  handleSaveEditDepartment,
  editDeptForm,
  setEditDeptForm,
  deptError,
  deptSuccess,
  handleCancelEdit,
}) {
  return (
    <div className="admin-add-dept-form-container">
      <form className="admin-add-dept-form" onSubmit={handleSaveEditDepartment}>
        <div className="admin-form-group">
          <label className="admin-form-label">Department ID (Read-only)</label>
          <input type="text" className="admin-form-input" value={editDeptForm.id} disabled />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Full Name</label>
          <input
            type="text"
            className="admin-form-input"
            value={editDeptForm.name}
            onChange={(e) => setEditDeptForm({ ...editDeptForm, name: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Short Name / Code</label>
          <input
            type="text"
            className="admin-form-input"
            value={editDeptForm.shortName}
            onChange={(e) =>
              setEditDeptForm({ ...editDeptForm, shortName: e.target.value })
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Color</label>
          <div className="admin-color-picker">
            <input
              type="color"
              className="admin-form-color"
              value={editDeptForm.color}
              onChange={(e) => setEditDeptForm({ ...editDeptForm, color: e.target.value })}
            />
            <span className="admin-color-value">{editDeptForm.color}</span>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Number of Semesters</label>
          <select
            className="admin-form-input"
            value={editDeptForm.semesters}
            onChange={(e) =>
              setEditDeptForm({ ...editDeptForm, semesters: e.target.value })
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                {s} Semester{s > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Years of Question Papers</label>
          <select
            className="admin-form-input"
            value={editDeptForm.years}
            onChange={(e) => setEditDeptForm({ ...editDeptForm, years: e.target.value })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 10].map((y) => (
              <option key={y} value={y}>
                {y} Year{y > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {deptError && (
          <div className="admin-form-error">
            <AlertTriangle size={12} />
            {deptError}
          </div>
        )}

        {deptSuccess && (
          <div className="admin-form-success">
            <CheckCircle2 size={12} />
            {deptSuccess}
          </div>
        )}

        <div className="admin-form-actions">
          <button type="submit" className="admin-form-submit">
            <Upload size={13} />
            Save_Changes
          </button>
          <button type="button" className="admin-form-cancel" onClick={handleCancelEdit}>
            <X size={13} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
