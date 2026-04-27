import { useSemesters, useAllPapers, useDepartments } from '../../hooks/useDepartments';
import './SemesterSelector.css';

export default function SemesterSelector({ departmentId, selectedSemester, onSelect }) {
  const semesters = useSemesters(departmentId);
  const allPapers = useAllPapers();
  const { departments } = useDepartments();
  const currentDept = departments.find(d => 
    d.id === departmentId || 
    d._id === departmentId || 
    d.shortName?.toLowerCase() === departmentId?.toLowerCase()
  );

  return (
    <div className="semester-selector">
      <h3 className="semester-selector-title">Step 1 — Select Semester</h3>
      <div className="semester-grid">
        {semesters.map((sem) => {
          const count = allPapers.filter((p) => {
            const matchDept = currentDept ? (
              p.department === currentDept.id || 
              p.department === currentDept.fullName || 
              p.department === currentDept.shortName || 
              p.department === currentDept._id
            ) : p.department === departmentId;
            return matchDept && String(p.semester) === String(sem);
          }).length;
          return (
            <button
              key={sem}
              className={`semester-btn ${selectedSemester === sem ? 'active' : ''}`}
              onClick={() => onSelect(sem)}
            >
              <span className="semester-btn-num">{sem}</span>
              <span className="semester-btn-label">Sem</span>
              {count > 0 && (
                <span className="semester-btn-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
