import { useState } from "react";
import { Plus, Upload, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { addDepartment, getDepartments } from "../../../data/departments";

export default function DepartmentsTab({ allDepartments, setAllDepartments }) {
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deptError, setDeptError] = useState("");
  const [deptSuccess, setDeptSuccess] = useState("");

  const [newDeptForm, setNewDeptForm] = useState({
    id: "",
    name: "",
    shortName: "",
    color: "#92bcea",
    semesters: 8,
    years: 5,
  });

  const [editDeptForm, setEditDeptForm] = useState({
    id: "",
    name: "",
    shortName: "",
    color: "#92bcea",
    semesters: 8,
    years: 5,
  });

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setDeptError("");
    setDeptSuccess("");

    if (!newDeptForm.id.trim()) {
      setDeptError("Department ID is required");
      return;
    }
    if (!newDeptForm.name.trim()) {
      setDeptError("Department name is required");
      return;
    }
    if (!newDeptForm.shortName.trim()) {
      setDeptError("Short name is required");
      return;
    }

    try {
      const deptId = newDeptForm.id.toLowerCase().replace(/\s+/g, "-");
      const semesterCount = parseInt(newDeptForm.semesters) || 8;
      const yearsCount = parseInt(newDeptForm.years) || 5;

      addDepartment({
        id: deptId,
        name: newDeptForm.name,
        shortName: newDeptForm.shortName.toUpperCase(),
        color: newDeptForm.color,
        semesterCount,
        yearsCount,
      });

      setAllDepartments(getDepartments());
      window.dispatchEvent(new Event("departmentsUpdated"));

      setNewDeptForm({
        id: "",
        name: "",
        shortName: "",
        color: "#92bcea",
        semesters: 8,
        years: 5,
      });
      setShowAddDeptForm(false);
      setDeptSuccess("Department added successfully! ✓");

      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleEditDepartment = (dept) => {
    setEditingDeptId(dept.id);
    setEditDeptForm({
      id: dept.id,
      name: dept.name,
      shortName: dept.shortName,
      color: dept.color,
      semesters: dept.semesterCount || 8,
      years: dept.yearsCount || 5,
    });
    setShowEditForm(true);
    setDeptError("");
  };

  const handleSaveEditDepartment = (e) => {
    e.preventDefault();
    setDeptError("");
    setDeptSuccess("");

    if (!editDeptForm.name.trim()) {
      setDeptError("Department name is required");
      return;
    }
    if (!editDeptForm.shortName.trim()) {
      setDeptError("Short name is required");
      return;
    }

    try {
      const updatedDepts = allDepartments.map((dept) => {
        if (dept.id === editingDeptId) {
          return {
            ...dept,
            name: editDeptForm.name,
            shortName: editDeptForm.shortName.toUpperCase(),
            color: editDeptForm.color,
            semesterCount: parseInt(editDeptForm.semesters) || 8,
            yearsCount: parseInt(editDeptForm.years) || 5,
          };
        }
        return dept;
      });

      const serializeDepts = updatedDepts.map((dept) => ({
        ...dept,
        iconName: dept.icon?.name || "Monitor",
      }));

      localStorage.setItem("aus_vault_departments", JSON.stringify(serializeDepts));
      setAllDepartments(updatedDepts);
      window.dispatchEvent(new Event("departmentsUpdated"));

      setEditingDeptId(null);
      setShowEditForm(false);
      setDeptSuccess("Department updated successfully! ✓");

      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingDeptId(null);
    setEditDeptForm({
      id: "",
      name: "",
      shortName: "",
      color: "#92bcea",
      semesters: 8,
      years: 5,
    });
    setDeptError("");
  };

  return (
    <div className="admin-departments-section">
      <div className="admin-departments-header">
        <h2 className="admin-departments-title">Department_Management_System</h2>
        <button
          className="admin-add-dept-btn"
          onClick={() => setShowAddDeptForm(!showAddDeptForm)}
        >
          <Plus size={14} />
          Add_New_Department
        </button>
      </div>

      {showAddDeptForm && (
        <div className="admin-add-dept-form-container">
          <form className="admin-add-dept-form" onSubmit={handleAddDepartment}>
            <div className="admin-form-group">
              <label className="admin-form-label">Department ID</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g., mechanical, civil, petroleum"
                value={newDeptForm.id}
                onChange={(e) => setNewDeptForm({ ...newDeptForm, id: e.target.value })}
              />
              <small className="admin-form-hint">
                Unique identifier (lowercase, use hyphens for spaces)
              </small>
            </div>

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
                value={newDeptForm.years}
                onChange={(e) => setNewDeptForm({ ...newDeptForm, years: e.target.value })}
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
                Create_Department
              </button>
              <button
                type="button"
                className="admin-form-cancel"
                onClick={() => {
                  setShowAddDeptForm(false);
                  setNewDeptForm({
                    id: "",
                    name: "",
                    shortName: "",
                    color: "#92bcea",
                    semesters: 8,
                    years: 5,
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
      )}

      {showEditForm && (
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
      )}

      <div className="admin-departments-list-container">
        <h3 className="admin-departments-list-title">
          Active_Departments ({allDepartments.length})
        </h3>
        <div className="admin-departments-grid">
          {allDepartments.map((dept) => (
            <div key={dept.id} className="admin-dept-card">
              <div
                className="admin-dept-card-color"
                style={{ backgroundColor: dept.color }}
              />
              <div className="admin-dept-card-content">
                <h4 className="admin-dept-card-name">{dept.name}</h4>
                <p className="admin-dept-card-code">{dept.shortName}</p>
                <span className="admin-dept-card-id">[{dept.id}]</span>
                <div className="admin-dept-card-meta">
                  <small>{dept.semesterCount || 8} Semesters</small>
                  <small>{dept.yearsCount || 5} Years</small>
                </div>
              </div>
              <button
                className="admin-dept-card-edit"
                onClick={() => handleEditDepartment(dept)}
                title="Edit department"
              >
                ✎
              </button>
            </div>
          ))}
        </div>
        {allDepartments.length === 0 && (
          <div className="admin-no-departments">
            <p>No departments configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
