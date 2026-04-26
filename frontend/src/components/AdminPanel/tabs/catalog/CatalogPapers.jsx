import { Trash2 } from "lucide-react";
import { getSubjectsForSemester } from "../../../../data/departments";

export default function CatalogPapers({
  papersDept,
  setPapersDept,
  papersSemester,
  setPapersSemester,
  papersSubject,
  setPapersSubject,
  allDepartments,
  semestersData,
  allPapers,
  handleDeletePaper,
}) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", color: "var(--color-vault-steel)", marginBottom: "1.5rem" }}>
        Edit & Delete Question Papers
      </h3>

      <div className="admin-catalog-papers-grid">
        <div>
          <label style={{ fontSize: "0.75rem", color: "var(--color-vault-steel)", display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Department</label>
          <select
            value={papersDept || ""}
            onChange={(e) => {
              setPapersDept(e.target.value || null);
              setPapersSemester(null);
              setPapersSubject(null);
            }}
            style={{ width: "100%", padding: "0.5rem 0.75rem", backgroundColor: "rgba(22, 26, 34, 0.5)", border: "1px solid rgba(175, 179, 247, 0.2)", borderRadius: "6px", color: "#e6edf3", fontSize: "0.875rem", cursor: "pointer" }}
          >
            <option value="">Select Department...</option>
            {allDepartments.map((dept) => (
              <option key={dept.fullName} value={dept._id}>{dept.shortName} - {dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.75rem", color: "var(--color-vault-steel)", display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Semester</label>
          <select
            value={papersSemester || ""}
            onChange={(e) => {
              setPapersSemester(e.target.value ? parseInt(e.target.value) : null);
              setPapersSubject(null);
            }}
            disabled={!papersDept}
            style={{ width: "100%", padding: "0.5rem 0.75rem", backgroundColor: "rgba(22, 26, 34, 0.5)", border: "1px solid rgba(175, 179, 247, 0.2)", borderRadius: "6px", color: "#e6edf3", fontSize: "0.875rem", cursor: papersDept ? "pointer" : "not-allowed", opacity: papersDept ? 1 : 0.5 }}
          >
            <option value="">Select Semester...</option>
            {papersDept && semestersData.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.75rem", color: "var(--color-vault-steel)", display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Subject</label>
          <select
            value={papersSubject || ""}
            onChange={(e) => setPapersSubject(e.target.value || null)}
            disabled={!papersDept || !papersSemester}
            style={{ width: "100%", padding: "0.5rem 0.75rem", backgroundColor: "rgba(22, 26, 34, 0.5)", border: "1px solid rgba(175, 179, 247, 0.2)", borderRadius: "6px", color: "#e6edf3", fontSize: "0.875rem", cursor: papersDept && papersSemester ? "pointer" : "not-allowed", opacity: papersDept && papersSemester ? 1 : 0.5 }}
          >
            <option value="">Select Subject...</option>
            {papersDept && papersSemester && getSubjectsForSemester(allDepartments.find((d) => d.id === papersDept), papersSemester).map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "500px", overflowY: "auto" }}>
        {!papersDept ? (
          <p style={{ color: "var(--color-vault-steel)", textAlign: "center", padding: "2rem" }}>Select a department to view question papers</p>
        ) : !papersSemester ? (
          <p style={{ color: "var(--color-vault-steel)", textAlign: "center", padding: "2rem" }}>Select a semester to view question papers</p>
        ) : (
          (() => {
            const filteredPapers = allPapers.filter((paper) => {
              const deptMatch = paper.department === papersDept;
              const semMatch = paper.semester === papersSemester;
              const subjMatch = !papersSubject || paper.subject === papersSubject;
              return deptMatch && semMatch && subjMatch;
            });

            return filteredPapers.length === 0 ? (
              <p style={{ color: "var(--color-vault-steel)", textAlign: "center", padding: "2rem" }}>No question papers found for this selection</p>
            ) : (
              filteredPapers.map((paper) => (
                <div key={paper.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "rgba(175, 179, 247, 0.05)", border: "1px solid rgba(175, 179, 247, 0.1)", borderRadius: "6px", fontSize: "0.875rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{paper.subject}</div>
                    <div style={{ color: "var(--color-vault-steel)", fontSize: "0.8rem" }}>Year {paper.year}</div>
                  </div>
                  <button onClick={() => handleDeletePaper(paper.id)} style={{ backgroundColor: "transparent", border: "none", color: "#f87171", cursor: "pointer", padding: "0.5rem", display: "flex", alignItems: "center" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            );
          })()
        )}
      </div>
    </div>
  );
}
