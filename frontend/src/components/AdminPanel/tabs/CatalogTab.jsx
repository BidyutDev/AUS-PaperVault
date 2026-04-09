import { useState } from "react";
import { Book, CheckCircle2, Edit, Plus, Trash2, X } from "lucide-react";
import { getSubjectsForSemester, SEMESTERS } from "../../../data/departments";
import { deleteMockPaper } from "../../../data/mockPapers";
import { notifySuperAdminEvent } from "../../../data/adminNotifications";

export default function CatalogTab({
  allDepartments,
  setAllDepartments,
  semestersData,
  approvedPapers,
  allPapers,
}) {
  const [catalogTab, setCatalogTab] = useState("subjects"); // 'subjects' | 'semesters' | 'papers'
  const [selectedCatalogDept, setSelectedCatalogDept] = useState(null);
  const [selectedCatalogSemester, setSelectedCatalogSemester] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null); // {deptId, semester, oldName}
  const [editingSubjectName, setEditingSubjectName] = useState("");
  const [newSemester, setNewSemester] = useState("");

  const [papersDept, setPapersDept] = useState(null);
  const [papersSemester, setPapersSemester] = useState(null);
  const [papersSubject, setPapersSubject] = useState(null);

  const [deptError, setDeptError] = useState("");
  const [deptSuccess, setDeptSuccess] = useState("");

  const handleAddSubject = (deptId, semester, subjectName) => {
    if (!subjectName.trim()) {
      setDeptError("Please enter a subject name");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }

    try {
      const updatedDepts = allDepartments.map((dept) => {
        if (dept.id === deptId) {
          const updatedDept = { ...dept, semesters: { ...dept.semesters } };
          if (!updatedDept.semesters[semester])
            updatedDept.semesters[semester] = [];
          else
            updatedDept.semesters[semester] = [...updatedDept.semesters[semester]];

          if (!updatedDept.semesters[semester].includes(subjectName)) {
            updatedDept.semesters[semester] = [
              ...updatedDept.semesters[semester],
              subjectName,
            ];
          }
          return updatedDept;
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

      const dname = allDepartments.find((d) => d.id === deptId)?.name || deptId;
      notifySuperAdminEvent({
        title: "Catalog: subject added",
        body: `Added "${subjectName}" to ${dname}, semester ${semester}.`,
        linkTab: "catalog",
        type: "catalog",
      });

      setDeptSuccess(`Subject "${subjectName}" added successfully! ✓`);
      setNewSubjectName("");
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to add subject: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  const handleDeleteSubject = (deptId, semester, subjectName) => {
    try {
      const updatedDepts = allDepartments.map((dept) => {
        if (dept.id === deptId) {
          const updatedDept = { ...dept, semesters: { ...dept.semesters } };
          if (updatedDept.semesters[semester]) {
            updatedDept.semesters[semester] = updatedDept.semesters[semester].filter(
              (s) => s !== subjectName,
            );
          }
          return updatedDept;
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

      const dnameDel = allDepartments.find((d) => d.id === deptId)?.name || deptId;
      notifySuperAdminEvent({
        title: "Catalog: subject removed",
        body: `Removed "${subjectName}" from ${dnameDel}, semester ${semester}.`,
        linkTab: "catalog",
        type: "catalog",
      });

      setDeptSuccess(`Subject "${subjectName}" deleted successfully! ✓`);
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to delete subject: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  const handleEditSubject = (deptId, semester, oldName) => {
    setEditingSubject({ deptId, semester, oldName });
    setEditingSubjectName(oldName);
  };

  const handleUpdateSubject = (deptId, semester, oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingSubject(null);
      return;
    }

    try {
      const updatedDepts = allDepartments.map((dept) => {
        if (dept.id === deptId) {
          const updatedDept = { ...dept, semesters: { ...dept.semesters } };
          if (updatedDept.semesters[semester]) {
            updatedDept.semesters[semester] = updatedDept.semesters[semester].map((s) =>
              s === oldName ? newName : s,
            );
          }
          return updatedDept;
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

      const dnameRen = allDepartments.find((d) => d.id === deptId)?.name || deptId;
      notifySuperAdminEvent({
        title: "Catalog: subject renamed",
        body: `In ${dnameRen}, semester ${semester}: "${oldName}" → "${newName}".`,
        linkTab: "catalog",
        type: "catalog",
      });

      setDeptSuccess(`Subject renamed from "${oldName}" to "${newName}"! ✓`);
      setEditingSubject(null);
      setEditingSubjectName("");
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to update subject: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  const handleAddSemester = (semNum) => {
    const sem = parseInt(semNum);
    if (!sem || sem < 1 || sem > 16 || semestersData.includes(sem)) {
      setDeptError("Invalid semester or already exists (1-16)");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }

    try {
      const updatedSemesters = [...semestersData, sem].sort((a, b) => a - b);
      localStorage.setItem("aus_vault_semesters", JSON.stringify(updatedSemesters));
      window.dispatchEvent(new Event("semestersUpdated"));
      notifySuperAdminEvent({
        title: "Catalog: semester added",
        body: `Semester ${sem} is now available across the vault.`,
        linkTab: "catalog",
        type: "catalog",
      });
      setDeptSuccess(`Semester ${sem} added successfully! ✓`);
      setNewSemester("");
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to add semester: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  const handleDeleteSemester = (semester) => {
    if (!window.confirm(`Delete semester ${semester}? This action cannot be undone.`)) {
      return;
    }

    try {
      const updatedSemesters = semestersData.filter((s) => s !== semester);
      localStorage.setItem("aus_vault_semesters", JSON.stringify(updatedSemesters));
      window.dispatchEvent(new Event("semestersUpdated"));
      notifySuperAdminEvent({
        title: "Catalog: semester removed",
        body: `Semester ${semester} was removed from the catalog.`,
        linkTab: "catalog",
        type: "catalog",
      });
      setDeptSuccess(`Semester ${semester} deleted successfully! ✓`);
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to delete semester: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  const handleDeletePaper = (paperId) => {
    if (!window.confirm("Delete this question paper? This action cannot be undone.")) {
      return;
    }

    try {
      const paperMeta = allPapers.find((p) => p.id === paperId);
      const isMock = !approvedPapers.some((p) => p.id === paperId);
      if (isMock) {
        deleteMockPaper(paperId);
      } else {
        const updatedPapers = approvedPapers.filter((p) => p.id !== paperId);
        localStorage.setItem("approvedPapers", JSON.stringify(updatedPapers));
      }

      window.dispatchEvent(new Event("papersUpdated"));

      notifySuperAdminEvent({
        title: "Catalog: paper removed",
        body: paperMeta
          ? `Deleted "${paperMeta.subject || "paper"}" (${paperMeta.fileName || paperId}).`
          : `Removed question paper id ${paperId}.`,
        linkTab: "catalog",
        type: "catalog",
      });

      setDeptSuccess("Question paper deleted successfully! ✓");
      setTimeout(() => setDeptSuccess(""), 3000);
    } catch (err) {
      setDeptError("Failed to delete paper: " + err.message);
      setTimeout(() => setDeptError(""), 3000);
    }
  };

  return (
    <div
      className="admin-catalog-section animate-slideUp"
      style={{ padding: "2rem", height: "100%", overflowY: "auto", position: "relative" }}
    >
      <h2 className="admin-departments-title" style={{ marginBottom: "2rem" }}>
        Catalog_Management{" "}
        <Book
          size={18}
          style={{
            display: "inline",
            marginLeft: "0.5rem",
            color: "var(--color-vault-lavender)",
          }}
        />
      </h2>

      {deptError && (
        <div style={{ color: "var(--color-vault-danger)", marginBottom: "1rem" }}>
          {deptError}
        </div>
      )}
      {deptSuccess && (
        <div style={{ color: "var(--color-vault-success)", marginBottom: "1rem" }}>
          {deptSuccess}
        </div>
      )}

      {/* Catalog Management Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "1px solid rgba(175, 179, 247, 0.1)",
          paddingBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {["subjects", "semesters", "papers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCatalogTab(tab)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: catalogTab === tab ? "rgba(175, 179, 247, 0.2)" : "transparent",
              border:
                catalogTab === tab
                  ? "1px solid rgba(175, 179, 247, 0.5)"
                  : "1px solid rgba(175, 179, 247, 0.1)",
              color: "#e6edf3",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.875rem",
              fontWeight: catalogTab === tab ? "600" : "400",
              textTransform: "capitalize",
            }}
            onMouseEnter={(e) => {
              if (catalogTab !== tab) {
                e.target.style.borderColor = "rgba(175, 179, 247, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (catalogTab !== tab) {
                e.target.style.borderColor = "rgba(175, 179, 247, 0.1)";
              }
            }}
          >
            {tab === "papers" ? "Question Papers" : tab === "semesters" ? "Semesters" : "Subjects"}
          </button>
        ))}
      </div>

      {catalogTab === "subjects" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", height: "100%" }}>
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
                <option key={dept.id} value={dept.id}>
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
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete subject "${subject}"?`)) {
                                    handleDeleteSubject(
                                      selectedCatalogDept,
                                      selectedCatalogSemester,
                                      subject,
                                    );
                                  }
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
      )}

      {catalogTab === "semesters" && (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--color-vault-steel)", marginBottom: "1rem" }}>
            Manage Semesters
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {semestersData.map((sem) => (
              <div
                key={sem}
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
                <span>Semester {sem}</span>
                <button
                  onClick={() => handleDeleteSemester(sem)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              placeholder="Enter semester (1-16)"
              value={newSemester}
              onChange={(e) => setNewSemester(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddSemester(newSemester);
                }
              }}
              min="1"
              max="16"
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
              onClick={() => handleAddSemester(newSemester)}
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
              Add Semester
            </button>
          </div>
        </div>
      )}

      {catalogTab === "papers" && (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--color-vault-steel)", marginBottom: "1.5rem" }}>
            Edit & Delete Question Papers
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
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
                  <option key={dept.id} value={dept.id}>{dept.shortName} - {dept.name}</option>
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
      )}
    </div>
  );
}
