import { BookOpen } from 'lucide-react';
import { getAllPapers } from '../../data/mockPapers';
import './SubjectSelector.css';

export default function SubjectSelector({ subjects, departmentId, semester, selectedSubject, onSelect }) {
  const allPapers = getAllPapers();

  return (
    <div className="subject-selector">
      <h3 className="subject-selector-title">Step 2 — Select Subject</h3>
      <div className="subject-list">
        {subjects.map((subject, index) => {
          const count = allPapers.filter(
            (p) => p.department === departmentId && p.subject === subject && p.semester === semester
          ).length;
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
