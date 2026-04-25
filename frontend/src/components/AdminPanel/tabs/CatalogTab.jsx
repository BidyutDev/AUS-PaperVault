import { useState } from "react";
import { Book } from "lucide-react";
import { deleteMockPaper } from "../../../data/mockPapers";
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
    setConfirmAction({
      type: "semester",
      title: "Delete Semester",
      message: `Are you sure you want to delete Semester ${semester}? All subjects within this semester will be affected. This action cannot be undone.`,
      payload: { semester },
    });
  };

  const executeDeleteSemester = (semester) => {

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
    const paperMeta = allPapers.find((p) => p.id === paperId);
    setConfirmAction({
      type: "paper",
      title: "Delete Question Paper",
      message: `Are you sure you want to delete "${paperMeta?.subject || "this paper"}" (${paperMeta?.fileName || paperId})? This action cannot be undone.`,
      payload: { paperId },
    });
  };

  const executeDeletePaper = (paperId) => {

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
        />
      )}

      {catalogTab === "semesters" && (
        <CatalogSemesters
          semestersData={semestersData}
          newSemester={newSemester}
          setNewSemester={setNewSemester}
          handleAddSemester={handleAddSemester}
          handleDeleteSemester={handleDeleteSemester}
        />
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
          semestersData={semestersData}
          allPapers={allPapers}
          handleDeletePaper={handleDeletePaper}
        />
      )}
    </div>
  );
}
