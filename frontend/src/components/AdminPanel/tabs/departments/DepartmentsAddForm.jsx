import { AlertTriangle, CheckCircle2, Upload, X } from "lucide-react";
import IconPicker from "./IconPicker";

export default function DepartmentsAddForm({
  handleAddDepartment,
  newDeptForm,
  setNewDeptForm,
  deptError,
  setDeptError,
  deptSuccess,
  setShowAddDeptForm,
}) {
  return (
    <div className="admin-add-dept-form-container">
      <form className="admin-add-dept-form" onSubmit={handleAddDepartment}>
        <div className="admin-form-group">
          <label className="admin-form-label">Full Name</label>
          <input
            type="text"
            className="admin-form-input"
            placeholder="e.g., Mechanical Engineering"
            value={newDeptForm.name}
            onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Short Name / Code</label>
          <input
            type="text"
            className="admin-form-input"
            placeholder="e.g., ME, CIVIL, PETRO"
            value={newDeptForm.shortName}
            onChange={(e) =>
              setNewDeptForm({ ...newDeptForm, shortName: e.target.value })
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Color</label>
          <div className="admin-color-picker">
            <input
              type="color"
              className="admin-form-color"
              value={newDeptForm.color}
              onChange={(e) => setNewDeptForm({ ...newDeptForm, color: e.target.value })}
            />
            <span className="admin-color-value">{newDeptForm.color}</span>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Number of Semesters</label>
          <select
            className="admin-form-input"
            value={newDeptForm.semesters}
            onChange={(e) =>
              setNewDeptForm({ ...newDeptForm, semesters: e.target.value })
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((s) => (
              <option key={s} value={s}>
                {s} Semester{s > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Icon Picker */}
        <IconPicker
          selectedIcon={newDeptForm.iconName}
          onSelect={(iconName) => setNewDeptForm({ ...newDeptForm, iconName })}
          departmentName={newDeptForm.name}
        />

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
            Create_Department
          </button>
          <button
            type="button"
            className="admin-form-cancel"
            onClick={() => {
              setShowAddDeptForm(false);
              setNewDeptForm({
                name: "",
                shortName: "",
                color: "#92bcea",
                semesters: 8,
                iconName: "",
              });
              setDeptError("");
            }}
          >
            <X size={13} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
