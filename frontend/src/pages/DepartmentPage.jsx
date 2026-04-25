import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartments";
import { getSubjectsForSemester } from "../data/departments";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SemesterSelector from "../components/SemesterSelector/SemesterSelector";
import SubjectSelector from "../components/SubjectSelector/SubjectSelector";
import YearSelector from "../components/YearSelector/YearSelector";
import PaperList from "../components/PaperList/PaperList";
import { motion } from "framer-motion";
import "./DepartmentPage.css";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function DepartmentPage() {
  const { deptId } = useParams();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const department = useDepartment(deptId);

  // Loading state
  if (department === undefined) {
    return (
      <motion.div
        className="page-enter"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="container-vault"
          style={{ padding: "4rem 1rem", textAlign: "center" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-vault-text)",
              marginBottom: "1rem",
            }}
          >
            Loading Department...
          </h1>
        </div>
      </motion.div>
    );
  }

  if (!department) {
    return (
      <motion.div
        className="page-enter"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="container-vault"
          style={{ padding: "4rem 1rem", textAlign: "center" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-vault-danger)",
              marginBottom: "1rem",
            }}
          >
            Department Not Found
          </h1>
          <p style={{ color: "var(--color-vault-gray)" }}>
            The department you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </motion.div>
    );
  }

  const Icon = department.icon;
  const semesterSubjects = selectedSemester
    ? getSubjectsForSemester(department, selectedSemester)
    : [];

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      label: department.name,
      to: selectedSemester ? `/department/${deptId}` : null,
    },
  ];
  if (selectedSemester) {
    breadcrumbItems.push({
      label: `Semester ${selectedSemester}`,
      to: selectedSubject ? `/department/${deptId}` : null,
    });
  }
  if (selectedSubject) {
    breadcrumbItems.push({ label: selectedSubject });
  }

  return (
    <motion.div
      className="page-enter"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container-vault dept-page">
        <Breadcrumb items={breadcrumbItems} />

        {/* Department Header */}
        <div className="dept-page-header">
          <div className="dept-page-icon" style={{ color: department.color }}>
            <Icon />
          </div>
          <div>
            <h1 className="dept-page-title">{department.name}</h1>
            <p className="dept-page-short">{department.shortName}</p>
          </div>
        </div>

        {/* Step 1: Semester Selection (always visible) */}
        <SemesterSelector
          departmentId={department.id}
          selectedSemester={selectedSemester}
          onSelect={(sem) => {
            setSelectedSemester(sem);
            setSelectedSubject(null); // reset subject when semester changes
            setSelectedYear(null); // reset year when semester changes
          }}
        />

        {/* Step 2: Subject Selection (after semester is selected) */}
        {selectedSemester && (
          <div className="animate-slideUp">
            <SubjectSelector
              subjects={semesterSubjects}
              departmentId={department.id}
              semester={selectedSemester}
              selectedSubject={selectedSubject}
              onSelect={(subject) => {
                setSelectedSubject(subject);
                setSelectedYear(null); // reset year when subject changes
              }}
            />
          </div>
        )}

        {/* Step 3: Year Selection (after subject is selected) */}
        {selectedSemester && selectedSubject && (
          <div className="animate-slideUp">
            <YearSelector
              departmentId={department.id}
              semester={selectedSemester}
              subject={selectedSubject}
              selectedYear={selectedYear}
              onSelect={setSelectedYear}
            />
          </div>
        )}

        {/* Step 4: Paper List with Year filter (after subject is selected) */}
        {selectedSemester && selectedSubject && (
          <div className="animate-slideUp">
            <PaperList
              departmentId={department.id}
              subject={selectedSubject}
              semester={selectedSemester}
              selectedYear={selectedYear}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
