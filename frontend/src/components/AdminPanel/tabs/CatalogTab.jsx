import { useState } from "react";
import { Book } from "lucide-react";
import { notifySuperAdminEvent } from "../../../data/adminNotifications";
import ConfirmModal from "../ConfirmModal";
import CatalogNav from "./catalog/CatalogNav";
import CatalogSubjects from "./catalog/CatalogSubjects";
import CatalogSemesters from "./catalog/CatalogSemesters";
import CatalogPapers from "./catalog/CatalogPapers";
import { apiFetch } from "../../../api/api";
import getDepartments from "../../../data/departments";

export default function CatalogTab({
  allDepartments,
  setAllDepartments,
  approvedPapers,
  allPapers,
  currentAdmin,
}) {
  const canDelete = currentAdmin?.role === "Super Admin";
  const [catalogTab, setCatalogTab] = useState("subjects"); // 'subjects' | 'semesters' | 'papers'
  const [selectedCatalogDept, setSelectedCatalogDept] = useState(null);
  const [selectedCatalogSemester, setSelectedCatalogSemester] = useState(null);
  const [selectedSemesterDept, setSelectedSemesterDept] = useState(null); // For semester management
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null); // {deptId, semester, oldName}
  const [editingSubjectName, setEditingSubjectName] = useState("");
  const [newSemester, setNewSemester] = useState("");
  const [deptName, setDeptName] = useState("")

  const [papersDept, setPapersDept] = useState(null);
  const [papersSemester, setPapersSemester] = useState(null);
  const [papersSubject, setPapersSubject] = useState(null);

  const [deptError, setDeptError] = useState("");
  const [deptSuccess, setDeptSuccess] = useState("");

  // Confirmation modal state: { type, title, message, payload }
  const [confirmAction, setConfirmAction] = useState(null);

  const handleAddSubject = async (deptId, semester, subjectName) => {
    if (!subjectName.trim()) {
      setDeptError("Please enter a subject name");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }
    try {
      const res = await apiFetch("/department/subject/add" , "POST" , {
        headers: {
          authorization : `Bearer ${localStorage.getItem("access_token")}`
        },
        body: {
          deptId,
          semester: String(semester),
          subject: subjectName,
        }
      });
      if(!res.success) {
        setDeptError(res.message || res.error);
        return;
      }
      const updatedDepts = await getDepartments();

      setAllDepartments(updatedDepts);
      window.dispatchEvent(new Event("departmentsUpdated"));

      notifySuperAdminEvent({
        title: "Catalog: subject added",
        body: `Added "${subjectName}" to ${res.department.fullName}, semester ${semester}.`,
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

  const handleDeleteSubject = async (deptId, semester, subjectName) => {
    try {

      const res = await apiFetch("/department/subject/delete" , "POST" , {
        headers: {
          authorization : `Bearer ${localStorage.getItem("access_token")}`
        },
        body: {
          deptId,
          semester: String(semester),
          subject: subjectName,
        }
      });
      if(!res.success) {
        setDeptError(res.message || res.error);
        return;
      }
      const updatedDepts = await getDepartments();
      setAllDepartments(updatedDepts);
      window.dispatchEvent(new Event("departmentsUpdated"));

      notifySuperAdminEvent({
        title: "Catalog: subject removed",
        body: `Removed "${subjectName}" from ${res.department.fullName}, semester ${semester}.`,
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

  const handleUpdateSubject = async (deptId, semester, oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingSubject(null);
      return;
    }

    try {
      const res = await apiFetch("/department/subject/edit" , "POST" , {
        headers: {
          authorization : `Bearer ${localStorage.getItem("access_token")}`
        },
        body: {
          deptId,
          semester: String(semester),
          subject: oldName,
          newSubject: newName
        }
      });
      if(!res.success) {
        setDeptError(res.message || res.error);
        return;
      }
      
      const updatedDepts = await getDepartments();
      setAllDepartments(updatedDepts);
      window.dispatchEvent(new Event("departmentsUpdated"));

      notifySuperAdminEvent({
        title: "Catalog: subject renamed",
        body: `In ${res.department.fullName}, semester ${semester}: "${oldName}" → "${newName}".`,
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

  const handleAddSemester = async (semNum) => {
    if (!selectedSemesterDept) {
      setDeptError("Please select a department first");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }

    const sem = parseInt(semNum);
    if (!sem || sem < 1 || sem > 16) {
      setDeptError("Invalid semester (1-16)");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }

    try {
      const res = await apiFetch("/department/semester/add", "POST", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: {
          deptId: selectedSemesterDept,
          semester: String(sem),
        }
      });

      if (!res.success) {
        setDeptError(res.message || res.error);
        setTimeout(() => setDeptError(""), 3000);
        return;
      }

      const updatedDepts = await getDepartments();
      setAllDepartments(updatedDepts);
      window.dispatchEvent(new Event("semestersUpdated"));
      
      notifySuperAdminEvent({
        title: "Catalog: semester added",
        body: `Semester ${sem} added successfully.`,
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
    setConfirmAction({
      type: "semester",
      title: "Delete Semester",
      message: `Are you sure you want to delete Semester ${semester}? All subjects within this semester will be affected. This action cannot be undone.`,
      payload: { semester },
    });
  };

  const executeDeleteSemester = async (semester) => {
    if (!selectedSemesterDept) {
      setDeptError("Please select a department first");
      setTimeout(() => setDeptError(""), 3000);
      return;
    }

    try {
      const res = await apiFetch("/department/semester/delete", "POST", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: {
          deptId: selectedSemesterDept,
          semester: String(semester)
        }
      });
      if (!res.success) {
        setDeptError(res.message || res.error);
        setTimeout(() => setDeptError(""), 3000);
        return;
      }

      const updatedDepts = await getDepartments();
      setAllDepartments(updatedDepts);
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
    const paperMeta = allPapers.find((p) => p.id === paperId);
    setConfirmAction({
      type: "paper",
      title: "Delete Question Paper",
      message: `Are you sure you want to delete "${paperMeta?.subject || "this paper"}" (${paperMeta?.fileName || paperId})? This action cannot be undone.`,
      payload: { paperId },
    });
  };

  const executeDeletePaper = async (paperId) => {
    try {
      const paperMeta = allPapers.find((p) => p.id === paperId);
      
      const res = await apiFetch(`/files/delete/${paperId}`, "DELETE", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (!res.success) {
        setDeptError(res.message || res.error || "Failed to delete paper");
        setTimeout(() => setDeptError(""), 3000);
        return;
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

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { type, payload } = confirmAction;
    setConfirmAction(null);

    if (type === "subject") {
      handleDeleteSubject(payload.deptId, payload.semester, payload.subjectName);
    } else if (type === "semester") {
      executeDeleteSemester(payload.semester);
    } else if (type === "paper") {
      executeDeletePaper(payload.paperId);
    }
  };

  return (
    <div
      className="admin-catalog-section animate-slideUp"
      style={{ padding: "2rem", height: "100%", overflowY: "auto", position: "relative" }}
    >
      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.title || "Confirm Deletion"}
        message={confirmAction?.message || ""}
        confirmLabel="Yes, Delete"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
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

      <CatalogNav catalogTab={catalogTab} setCatalogTab={setCatalogTab} />

      {catalogTab === "subjects" && (
        <CatalogSubjects
          allDepartments={allDepartments}
          selectedCatalogDept={selectedCatalogDept}
          setSelectedCatalogDept={setSelectedCatalogDept}
          selectedCatalogSemester={selectedCatalogSemester}
          setSelectedCatalogSemester={setSelectedCatalogSemester}
          editingSubject={editingSubject}
          setEditingSubject={setEditingSubject}
          editingSubjectName={editingSubjectName}
          setEditingSubjectName={setEditingSubjectName}
          newSubjectName={newSubjectName}
          setNewSubjectName={setNewSubjectName}
          handleUpdateSubject={handleUpdateSubject}
          handleEditSubject={handleEditSubject}
          setConfirmAction={setConfirmAction}
          handleAddSubject={handleAddSubject}
          canDelete={canDelete}
        />
      )}

      {catalogTab === "semesters" && (
        <>
          <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h4 style={{ fontSize: "0.875rem", color: "var(--color-vault-steel)", marginBottom: "1rem" }}>
              Select Department
            </h4>
            <select
              value={selectedSemesterDept || ""}
              onChange={(e) => setSelectedSemesterDept(e.target.value || null)}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "rgba(22, 26, 34, 0.5)",
                border: "1px solid rgba(175, 179, 247, 0.2)",
                borderRadius: "6px",
                color: "#e6edf3",
                fontSize: "0.875rem",
              }}
            >
              <option value="">-- Select a Department --</option>
              {allDepartments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.fullName} ({dept.shortName})
                </option>
              ))}
            </select>
          </div>
          {selectedSemesterDept && (
            <CatalogSemesters
              semestersData={Object.keys(allDepartments.find(d => d._id === selectedSemesterDept)?.semesters || {}).map(Number).sort((a, b) => a - b)}
              newSemester={newSemester}
              setNewSemester={setNewSemester}
              handleAddSemester={handleAddSemester}
              handleDeleteSemester={handleDeleteSemester}
            />
          )}
        </>
      )}

      {catalogTab === "papers" && (
        <CatalogPapers
          papersDept={papersDept}
          setPapersDept={setPapersDept}
          papersSemester={papersSemester}
          setPapersSemester={setPapersSemester}
          papersSubject={papersSubject}
          setPapersSubject={setPapersSubject}
          allDepartments={allDepartments}
          semestersData={papersDept ? Object.keys(allDepartments.find(d => d._id === papersDept)?.semesters || {}).map(Number).sort((a, b) => a - b) : []}
          allPapers={allPapers}
          handleDeletePaper={handleDeletePaper}
          canDelete={canDelete}
        />
      )}
    </div>
  );
}
