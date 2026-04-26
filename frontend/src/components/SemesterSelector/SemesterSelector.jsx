import { useSemesters, useAllPapers } from '../../hooks/useDepartments';
import './SemesterSelector.css';

export default function SemesterSelector({ departmentId, selectedSemester, onSelect }) {
  const semesters = useSemesters(departmentId);
  const allPapers = useAllPapers();

  return (
    <div className="semester-selector">
      <h3 className="semester-selector-title">Step 1 — Select Semester</h3>
      <div className="semester-grid">
        {semesters.map((sem) => {
          const count = allPapers.filter(
            (p) => p.department === departmentId && p.semester === sem
          ).length;
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
