import { BookOpen } from 'lucide-react';
import { useAllPapers, useDepartments } from '../../hooks/useDepartments';
import './SubjectSelector.css';

export default function SubjectSelector({ subjects, departmentId, semester, selectedSubject, onSelect }) {
  const allPapers = useAllPapers();
  const { departments } = useDepartments();
  const currentDept = departments.find(d => 
    d.id === departmentId || 
    d._id === departmentId || 
    d.shortName?.toLowerCase() === departmentId?.toLowerCase()
  );

  return (
    <div className="subject-selector">
      <h3 className="subject-selector-title">Step 2 — Select Subject</h3>
      <div className="subject-list">
        {subjects.map((subject, index) => {
          const count = allPapers.filter((p) => {
            const matchDept = currentDept ? (
              p.department === currentDept.id || 
              p.department === currentDept.fullName || 
              p.department === currentDept.shortName || 
              p.department === currentDept._id
            ) : p.department === departmentId;
            return matchDept && p.subject === subject && String(p.semester) === String(semester);
          }).length;
          return (
            <button
              key={index}
              className={`subject-item ${selectedSubject === subject ? 'active' : ''}`}
              onClick={() => onSelect(subject)}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="subject-item-icon">
                <BookOpen />
              </div>
              <span className="subject-item-name">{subject}</span>
              <span className="subject-item-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
