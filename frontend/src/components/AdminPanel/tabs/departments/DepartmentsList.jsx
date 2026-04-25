import { Trash2, Edit2 } from "lucide-react";

export default function DepartmentsList({
  allDepartments,
  handleEditDepartment,
  handleDeleteDepartment,
  canDelete = true,
}) {
  return (
    <div className="admin-departments-list-container">
      <h3 className="admin-departments-list-title">
        Active_Departments ({allDepartments.length})
      </h3>
      <div className="admin-departments-grid">
        {allDepartments.map((dept) => (
          <div key={dept._id} className="admin-dept-card">
            <div
              className="admin-dept-card-color"
              style={{ backgroundColor: dept.color }}
            />
            <div className="admin-dept-card-content">
              <h4 className="admin-dept-card-name">{dept.name}</h4>
              <p className="admin-dept-card-code">{dept.shortName}</p>
              <div className="admin-dept-card-meta">
                <small>{Object.keys(dept.semesters).length} Semesters</small>
                <small>{dept.years.length} Years</small>
              </div>
            </div>
            <button
              className="admin-dept-card-edit"
              onClick={() => handleEditDepartment(dept)}
              title="Edit department"
            >
              <Edit2 size={14} />
            </button>
            {canDelete && (
              <button
                className="admin-dept-card-delete"
                onClick={() => handleDeleteDepartment(dept)}
                title="Delete department"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {allDepartments.length === 0 && (
        <div className="admin-no-departments">
          <p>No departments configured yet.</p>
        </div>
      )}
    </div>
  );
}
