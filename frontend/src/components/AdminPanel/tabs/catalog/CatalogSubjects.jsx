import { CheckCircle2, Edit, Plus, Trash2, X } from "lucide-react";
import { getSubjectsForSemester, SEMESTERS } from "../../../../data/departments";

export default function CatalogSubjects({
  allDepartments,
  selectedCatalogDept,
  setSelectedCatalogDept,
  selectedCatalogSemester,
  setSelectedCatalogSemester,
  editingSubject,
  setEditingSubject,
  editingSubjectName,
  setEditingSubjectName,
  newSubjectName,
  setNewSubjectName,
  handleUpdateSubject,
  handleEditSubject,
  setConfirmAction,
  handleAddSubject,
  canDelete = true,
}) {
  return (
    <div className="admin-catalog-subjects-grid">
      <div className="glass-card" style={{ padding: "1.5rem", height: "fit-content" }}>
        <h3
          style={{
            fontSize: "1rem",
            color: "var(--color-vault-steel)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Departments
        </h3>
        <select
          value={selectedCatalogDept || ""}
          onChange={(e) => {
            setSelectedCatalogDept(e.target.value || null);
            setSelectedCatalogSemester(null);
          }}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "rgba(22, 26, 34, 0.5)",
            border: "1px solid rgba(175, 179, 247, 0.2)",
            borderRadius: "8px",
            color: "#e6edf3",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <option value="">Select Department...</option>
          {allDepartments.map((dept) => (
            <option key={dept.fullName} value={dept.shortName}>
              {dept.shortName} - {dept.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCatalogDept ? (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--color-vault-steel)",
              marginBottom: "1rem",
            }}
          >
            Semesters
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedCatalogSemester(sem)}
                style={{
                  padding: "0.5rem",
                  backgroundColor:
                    selectedCatalogSemester === sem
                      ? "rgba(175, 179, 247, 0.2)"
                      : "transparent",
                  border:
                    selectedCatalogSemester === sem
                      ? "1px solid rgba(175, 179, 247, 0.5)"
                      : "1px solid rgba(175, 179, 247, 0.2)",
                  color: "#e6edf3",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                Sem_{sem}
              </button>
            ))}
          </div>

          {selectedCatalogSemester && (
            <div>
              <h4
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-vault-steel)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Subjects - Semester {selectedCatalogSemester}
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {getSubjectsForSemester(
                  allDepartments.find((d) => d.id === selectedCatalogDept),
                  selectedCatalogSemester,
                ).map((subject, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(175, 179, 247, 0.05)",
                      border: "1px solid rgba(175, 179, 247, 0.1)",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {editingSubject?.oldName === subject &&
                    editingSubject?.deptId === selectedCatalogDept &&
                    editingSubject?.semester === selectedCatalogSemester ? (
                      <input
                        type="text"
                        value={editingSubjectName}
                        onChange={(e) => setEditingSubjectName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateSubject(
                              selectedCatalogDept,
                              selectedCatalogSemester,
                              subject,
                              editingSubjectName,
                            );
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "rgba(22, 26, 34, 0.5)",
                          border: "1px solid rgba(175, 179, 247, 0.3)",
                          borderRadius: "4px",
                          color: "#e6edf3",
                          fontSize: "0.875rem",
                        }}
                        autoFocus
                      />
                    ) : (
                      <span>{subject}</span>
                    )}
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {editingSubject?.oldName === subject &&
                      editingSubject?.deptId === selectedCatalogDept &&
                      editingSubject?.semester === selectedCatalogSemester ? (
                        <>
                          <button
                            onClick={() => {
                              handleUpdateSubject(
                                selectedCatalogDept,
                                selectedCatalogSemester,
                                subject,
                                editingSubjectName,
                              );
                            }}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#92bcea",
                              cursor: "pointer",
                              padding: "0.25rem",
                            }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={() => setEditingSubject(null)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#607b96",
                              cursor: "pointer",
                              padding: "0.25rem",
                            }}
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleEditSubject(
                                selectedCatalogDept,
                                selectedCatalogSemester,
                                subject,
                              )
                            }
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#afb3f7",
                              cursor: "pointer",
                              padding: "0.25rem",
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => {
                                setConfirmAction({
                                  type: "subject",
                                  title: "Delete Subject",
                                  message: `Are you sure you want to delete subject "${subject}"? This action cannot be undone.`,
                                  payload: {
                                    deptId: selectedCatalogDept,
                                    semester: selectedCatalogSemester,
                                    subjectName: subject,
                                  },
                                });
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#f87171",
                                cursor: "pointer",
                                padding: "0.25rem",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Subject name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddSubject(selectedCatalogDept, selectedCatalogSemester, newSubjectName);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "rgba(22, 26, 34, 0.5)",
                    border: "1px solid rgba(175, 179, 247, 0.2)",
                    borderRadius: "6px",
                    color: "#e6edf3",
                    fontSize: "0.875rem",
                  }}
                />
                <button
                  onClick={() => {
                    handleAddSubject(selectedCatalogDept, selectedCatalogSemester, newSubjectName);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "rgba(175, 179, 247, 0.2)",
                    border: "1px solid rgba(175, 179, 247, 0.3)",
                    color: "#e6edf3",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <p style={{ color: "var(--color-vault-steel)", textAlign: "center" }}>
            Select a department to view and manage subjects
          </p>
        </div>
      )}
    </div>
  );
}
