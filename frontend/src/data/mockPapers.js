// Mock question papers for demonstration
// In production, these would come from an API
const mockPapers = [
  // CSE papers
  {
    id: 1,
    department: "cse",
    subject: "Data Structures & Algorithms",
    semester: 3,
    year: 2024,
    fileName: "DSA_2024_Sem3.pdf",
  },
  {
    id: 2,
    department: "cse",
    subject: "Data Structures & Algorithms",
    semester: 3,
    year: 2023,
    fileName: "DSA_2023_Sem3.pdf",
  },
  {
    id: 3,
    department: "cse",
    subject: "Data Structures & Algorithms",
    semester: 3,
    year: 2022,
    fileName: "DSA_2022_Sem3.pdf",
  },
  {
    id: 4,
    department: "cse",
    subject: "Operating Systems",
    semester: 4,
    year: 2024,
    fileName: "OS_2024_Sem4.pdf",
  },
  {
    id: 5,
    department: "cse",
    subject: "Operating Systems",
    semester: 4,
    year: 2023,
    fileName: "OS_2023_Sem4.pdf",
  },
  {
    id: 6,
    department: "cse",
    subject: "Database Management Systems",
    semester: 4,
    year: 2024,
    fileName: "DBMS_2024_Sem4.pdf",
  },
  {
    id: 7,
    department: "cse",
    subject: "Database Management Systems",
    semester: 4,
    year: 2022,
    fileName: "DBMS_2022_Sem4.pdf",
  },
  {
    id: 8,
    department: "cse",
    subject: "Computer Networks",
    semester: 5,
    year: 2024,
    fileName: "CN_2024_Sem5.pdf",
  },
  {
    id: 9,
    department: "cse",
    subject: "Computer Networks",
    semester: 5,
    year: 2023,
    fileName: "CN_2023_Sem5.pdf",
  },
  {
    id: 10,
    department: "cse",
    subject: "Software Engineering",
    semester: 5,
    year: 2024,
    fileName: "SE_2024_Sem5.pdf",
  },
  {
    id: 11,
    department: "cse",
    subject: "Compiler Design",
    semester: 6,
    year: 2023,
    fileName: "CD_2023_Sem6.pdf",
  },
  {
    id: 12,
    department: "cse",
    subject: "Artificial Intelligence",
    semester: 7,
    year: 2024,
    fileName: "AI_2024_Sem7.pdf",
  },
  {
    id: 13,
    department: "cse",
    subject: "Machine Learning",
    semester: 7,
    year: 2024,
    fileName: "ML_2024_Sem7.pdf",
  },
  {
    id: 14,
    department: "cse",
    subject: "Web Technologies",
    semester: 6,
    year: 2024,
    fileName: "WT_2024_Sem6.pdf",
  },
  {
    id: 15,
    department: "cse",
    subject: "Digital Logic Design",
    semester: 2,
    year: 2024,
    fileName: "DLD_2024_Sem2.pdf",
  },

  // ECE papers
  {
    id: 16,
    department: "ece",
    subject: "Analog Electronics",
    semester: 3,
    year: 2024,
    fileName: "AE_2024_Sem3.pdf",
  },
  {
    id: 17,
    department: "ece",
    subject: "Digital Electronics",
    semester: 3,
    year: 2023,
    fileName: "DE_2023_Sem3.pdf",
  },
  {
    id: 18,
    department: "ece",
    subject: "Signal Processing",
    semester: 4,
    year: 2024,
    fileName: "SP_2024_Sem4.pdf",
  },
  {
    id: 19,
    department: "ece",
    subject: "Communication Systems",
    semester: 5,
    year: 2024,
    fileName: "CS_2024_Sem5.pdf",
  },
  {
    id: 20,
    department: "ece",
    subject: "VLSI Design",
    semester: 6,
    year: 2023,
    fileName: "VLSI_2023_Sem6.pdf",
  },

  // Physics papers
  {
    id: 21,
    department: "physics",
    subject: "Classical Mechanics",
    semester: 1,
    year: 2024,
    fileName: "CM_2024_Sem1.pdf",
  },
  {
    id: 22,
    department: "physics",
    subject: "Quantum Mechanics",
    semester: 3,
    year: 2024,
    fileName: "QM_2024_Sem3.pdf",
  },
  {
    id: 23,
    department: "physics",
    subject: "Electrodynamics",
    semester: 2,
    year: 2023,
    fileName: "ED_2023_Sem2.pdf",
  },
  {
    id: 24,
    department: "physics",
    subject: "Statistical Mechanics",
    semester: 4,
    year: 2024,
    fileName: "SM_2024_Sem4.pdf",
  },
  {
    id: 25,
    department: "physics",
    subject: "Nuclear Physics",
    semester: 5,
    year: 2023,
    fileName: "NP_2023_Sem5.pdf",
  },

  // Chemistry papers
  {
    id: 26,
    department: "chemistry",
    subject: "Organic Chemistry",
    semester: 1,
    year: 2024,
    fileName: "OC_2024_Sem1.pdf",
  },
  {
    id: 27,
    department: "chemistry",
    subject: "Inorganic Chemistry",
    semester: 2,
    year: 2024,
    fileName: "IC_2024_Sem2.pdf",
  },
  {
    id: 28,
    department: "chemistry",
    subject: "Physical Chemistry",
    semester: 3,
    year: 2023,
    fileName: "PC_2023_Sem3.pdf",
  },

  // Mathematics papers
  {
    id: 29,
    department: "mathematics",
    subject: "Real Analysis",
    semester: 1,
    year: 2024,
    fileName: "RA_2024_Sem1.pdf",
  },
  {
    id: 30,
    department: "mathematics",
    subject: "Abstract Algebra",
    semester: 2,
    year: 2024,
    fileName: "AA_2024_Sem2.pdf",
  },
  {
    id: 31,
    department: "mathematics",
    subject: "Linear Algebra",
    semester: 3,
    year: 2023,
    fileName: "LA_2023_Sem3.pdf",
  },
  {
    id: 32,
    department: "mathematics",
    subject: "Differential Equations",
    semester: 4,
    year: 2024,
    fileName: "DE_2024_Sem4.pdf",
  },

  // English papers
  {
    id: 33,
    department: "english",
    subject: "British Literature",
    semester: 1,
    year: 2024,
    fileName: "BL_2024_Sem1.pdf",
  },
  {
    id: 34,
    department: "english",
    subject: "American Literature",
    semester: 3,
    year: 2023,
    fileName: "AL_2023_Sem3.pdf",
  },
  {
    id: 35,
    department: "english",
    subject: "Indian Writing in English",
    semester: 5,
    year: 2024,
    fileName: "IWE_2024_Sem5.pdf",
  },

  // Economics papers
  {
    id: 36,
    department: "economics",
    subject: "Microeconomics",
    semester: 1,
    year: 2024,
    fileName: "MICRO_2024_Sem1.pdf",
  },
  {
    id: 37,
    department: "economics",
    subject: "Macroeconomics",
    semester: 2,
    year: 2023,
    fileName: "MACRO_2023_Sem2.pdf",
  },
  {
    id: 38,
    department: "economics",
    subject: "Indian Economy",
    semester: 3,
    year: 2024,
    fileName: "IE_2024_Sem3.pdf",
  },

  // Commerce papers
  {
    id: 39,
    department: "commerce",
    subject: "Financial Accounting",
    semester: 1,
    year: 2024,
    fileName: "FA_2024_Sem1.pdf",
  },
  {
    id: 40,
    department: "commerce",
    subject: "Cost Accounting",
    semester: 3,
    year: 2023,
    fileName: "CA_2023_Sem3.pdf",
  },

  // Political Science papers
  {
    id: 41,
    department: "political-science",
    subject: "Political Theory",
    semester: 1,
    year: 2024,
    fileName: "PT_2024_Sem1.pdf",
  },
  {
    id: 42,
    department: "political-science",
    subject: "Indian Government & Politics",
    semester: 2,
    year: 2023,
    fileName: "IGP_2023_Sem2.pdf",
  },

  // Biotechnology papers
  {
    id: 43,
    department: "biotechnology",
    subject: "Molecular Biology",
    semester: 1,
    year: 2024,
    fileName: "MB_2024_Sem1.pdf",
  },
  {
    id: 44,
    department: "biotechnology",
    subject: "Genetic Engineering",
    semester: 4,
    year: 2023,
    fileName: "GE_2023_Sem4.pdf",
  },

  // More papers across departments...
  {
    id: 45,
    department: "ee",
    subject: "Circuit Theory",
    semester: 1,
    year: 2024,
    fileName: "CT_2024_Sem1.pdf",
  },
  {
    id: 46,
    department: "ee",
    subject: "Electrical Machines",
    semester: 3,
    year: 2023,
    fileName: "EM_2023_Sem3.pdf",
  },
  {
    id: 47,
    department: "me",
    subject: "Thermodynamics",
    semester: 2,
    year: 2024,
    fileName: "TD_2024_Sem2.pdf",
  },
  {
    id: 48,
    department: "me",
    subject: "Fluid Mechanics",
    semester: 3,
    year: 2023,
    fileName: "FM_2023_Sem3.pdf",
  },
  {
    id: 49,
    department: "civil",
    subject: "Structural Analysis",
    semester: 4,
    year: 2024,
    fileName: "SA_2024_Sem4.pdf",
  },
  {
    id: 50,
    department: "civil",
    subject: "Surveying",
    semester: 2,
    year: 2023,
    fileName: "SV_2023_Sem2.pdf",
  },
  {
    id: 51,
    department: "bengali",
    subject: "Bengali Poetry",
    semester: 1,
    year: 2024,
    fileName: "BP_2024_Sem1.pdf",
  },
  {
    id: 52,
    department: "bengali",
    subject: "Bengali Drama",
    semester: 3,
    year: 2023,
    fileName: "BD_2023_Sem3.pdf",
  },
  {
    id: 53,
    department: "environmental-science",
    subject: "Ecology",
    semester: 1,
    year: 2024,
    fileName: "ECO_2024_Sem1.pdf",
  },
  {
    id: 54,
    department: "environmental-science",
    subject: "Climate Change",
    semester: 4,
    year: 2023,
    fileName: "CC_2023_Sem4.pdf",
  },
];

// Helper to get papers from localStorage (approved uploads)
export function getApprovedPapers() {
  try {
    const stored = localStorage.getItem("approvedPapers");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to get pending uploads from localStorage
export function getPendingUploads() {
  try {
    const stored = localStorage.getItem("pendingUploads");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add a new upload to pending queue
export function addPendingUpload(upload) {
  const pending = getPendingUploads();
  const newUpload = {
    ...upload,
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  pending.push(newUpload);
  localStorage.setItem("pendingUploads", JSON.stringify(pending));
  return newUpload;
}

// Approve a pending upload
export function approveUpload(uploadId) {
  const pending = getPendingUploads();
  const approved = getApprovedPapers();
  const upload = pending.find((u) => u.id === uploadId);
  if (upload) {
    upload.status = "approved";
    upload.approvedAt = new Date().toISOString();
    approved.push(upload);
    const remaining = pending.filter((u) => u.id !== uploadId);
    localStorage.setItem("pendingUploads", JSON.stringify(remaining));
    localStorage.setItem("approvedPapers", JSON.stringify(approved));
  }
}

// Reject a pending upload
export function rejectUpload(uploadId) {
  const pending = getPendingUploads();
  const remaining = pending.filter((u) => u.id !== uploadId);
  localStorage.setItem("pendingUploads", JSON.stringify(remaining));
}

// Update a pending upload (e.g., year correction)
export function updatePendingUpload(uploadId, updates) {
  const pending = getPendingUploads();
  const upload = pending.find((u) => u.id === uploadId);
  if (upload) {
    Object.assign(upload, updates);
    localStorage.setItem("pendingUploads", JSON.stringify(pending));
  }
}

// Helper to get deleted mock papers from localStorage
export function getDeletedMockPapers() {
  try {
    const stored = localStorage.getItem("deletedMockPapers");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to mark a mock paper as deleted
export function deleteMockPaper(paperId) {
  const deleted = getDeletedMockPapers();
  if (!deleted.includes(paperId)) {
    deleted.push(paperId);
    localStorage.setItem("deletedMockPapers", JSON.stringify(deleted));
  }
}

// Get all non-deleted papers (mock + approved)
export function getAllPapers() {
  const deletedMockPaperIds = getDeletedMockPapers();
  const activeMockPapers = mockPapers.filter((p) => !deletedMockPaperIds.includes(p.id));
  return [...activeMockPapers, ...getApprovedPapers()];
}

// Get paper count by department
export function getPaperCountByDept(deptId) {
  return getAllPapers().filter((p) => p.department === deptId).length;
}

// Get total paper count
export function getTotalPaperCount() {
  return getAllPapers().length;
}

export default mockPapers;
