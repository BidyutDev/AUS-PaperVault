import { Plus } from "lucide-react";

export default function DepartmentsHeader({ showAddDeptForm, setShowAddDeptForm }) {
  return (
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
  );
}
