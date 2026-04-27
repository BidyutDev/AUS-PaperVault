import { Calendar } from "lucide-react";
import { useAllPapers, useDepartments } from "../../hooks/useDepartments";
import "./YearSelector.css";

export default function YearSelector({
  departmentId,
  semester,
  subject,
  selectedYear,
  onSelect,
}) {
  const allPapers = useAllPapers();
  const { departments } = useDepartments();
  const currentDept = departments.find(d => 
    d.id === departmentId || 
    d._id === departmentId || 
    d.shortName?.toLowerCase() === departmentId?.toLowerCase()
  );

  // Get unique years for this subject/semester/department combination
  const availableYears = [
    ...new Set(
      allPapers
        .filter((p) => {
          const matchDept = currentDept ? (
            p.department === currentDept.id || 
            p.department === currentDept.fullName || 
            p.department === currentDept.shortName || 
            p.department === currentDept._id
          ) : p.department === departmentId;
          return matchDept && p.subject === subject && String(p.semester) === String(semester);
        })
        .map((p) => p.year),
    ),
  ].sort((a, b) => b - a); // Sort descending (newest first)

  if (availableYears.length === 0) {
    return null; // Don't show if no papers available
  }

  return (
    <div className="year-selector">
      <h3 className="year-selector-title">Step 3 — Select Year (Optional)</h3>
      <div className="year-list">
        <button
          className={`year-item ${!selectedYear ? "active" : ""}`}
          onClick={() => onSelect(null)}
        >
          <div className="year-item-icon">
            <Calendar />
          </div>
          <div className="year-item-name">All</div>
        </button>
        {availableYears.map((year) => {
          return (
            <button
              key={year}
              className={`year-item ${selectedYear === year ? "active" : ""}`}
              onClick={() => onSelect(year)}
            >
              <div className="year-item-icon">
                <Calendar />
              </div>
              <div className="year-item-name">{year}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
