import {
  Monitor,
  Cpu,
  Zap,
  Cog,
  Building2,
  Atom,
  FlaskConical,
  Calculator,
  BookOpen,
  Languages,
  Landmark,
  TrendingUp,
  Briefcase,
  Leaf,
  Microscope,
} from "lucide-react";

// Icon mapping for serialization/deserialization
const ICON_MAP = {
  Monitor,
  Cpu,
  Zap,
  Cog,
  Building2,
  Atom,
  FlaskConical,
  Calculator,
  BookOpen,
  Languages,
  Landmark,
  TrendingUp,
  Briefcase,
  Leaf,
  Microscope,
};

// Subjects are organized per semester so that different semesters
// show their own unique subject lists.

const departments = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    shortName: "CSE",
    icon: Monitor,
    color: "#92bcea",
    semesters: {
      1: [
        "Mathematics I",
        "Physics",
        "Basic Electrical Engineering",
        "English Communication",
      ],
      2: [
        "Mathematics II",
        "Chemistry",
        "Programming in C",
        "Digital Logic Design",
      ],
      3: [
        "Data Structures & Algorithms",
        "Discrete Mathematics",
        "Object Oriented Programming",
        "Computer Organization",
      ],
      4: [
        "Operating Systems",
        "Database Management Systems",
        "Theory of Computation",
        "Computer Architecture",
      ],
      5: [
        "Computer Networks",
        "Software Engineering",
        "Microprocessors",
        "Design & Analysis of Algorithms",
      ],
      6: [
        "Compiler Design",
        "Web Technologies",
        "Artificial Intelligence",
        "Information Security",
      ],
      7: [
        "Machine Learning",
        "Cloud Computing",
        "Distributed Systems",
        "Image Processing",
      ],
      8: [
        "Deep Learning",
        "Blockchain Technology",
        "Natural Language Processing",
        "Project Work",
      ],
    },
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    shortName: "ECE",
    icon: Cpu,
    color: "#afb3f7",
    semesters: {
      1: [
        "Mathematics I",
        "Physics",
        "Basic Electronics",
        "English Communication",
      ],
      2: ["Mathematics II", "Chemistry", "Circuit Theory", "Programming in C"],
      3: [
        "Analog Electronics",
        "Digital Electronics",
        "Signals & Systems",
        "Network Analysis",
      ],
      4: [
        "Signal Processing",
        "Communication Systems",
        "Electromagnetic Theory",
        "Microprocessors",
      ],
      5: [
        "VLSI Design",
        "Control Systems",
        "Antenna & Wave Propagation",
        "Digital Communication",
      ],
      6: [
        "Embedded Systems",
        "Optical Communication",
        "Wireless Communication",
        "DSP Applications",
      ],
      7: [
        "Satellite Communication",
        "IoT & Sensor Networks",
        "Radar Engineering",
        "Microwave Engineering",
      ],
      8: [
        "RF Circuit Design",
        "Advanced Communication",
        "Nanoelectronics",
        "Project Work",
      ],
    },
  },
  {
    id: "ee",
    name: "Electrical Engineering",
    shortName: "EE",
    icon: Zap,
    color: "#fbbf24",
    semesters: {
      1: [
        "Mathematics I",
        "Physics",
        "Basic Electrical Engineering",
        "English Communication",
      ],
      2: ["Mathematics II", "Chemistry", "Circuit Theory", "Programming in C"],
      3: [
        "Electrical Machines I",
        "Analog Electronics",
        "Electrical Measurements",
        "Network Theory",
      ],
      4: [
        "Electrical Machines II",
        "Power Systems I",
        "Control Systems",
        "Signals & Systems",
      ],
      5: [
        "Power Electronics",
        "Power Systems II",
        "Transmission & Distribution",
        "Microprocessors",
      ],
      6: [
        "Switchgear & Protection",
        "Electric Drives",
        "Renewable Energy",
        "Instrumentation",
      ],
      7: [
        "Power System Analysis",
        "High Voltage Engineering",
        "FACTS & HVDC",
        "Smart Grid",
      ],
      8: [
        "Power Quality",
        "Energy Auditing",
        "Advanced Control Systems",
        "Project Work",
      ],
    },
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    shortName: "ME",
    icon: Cog,
    color: "#7a93ac",
    semesters: {
      1: [
        "Mathematics I",
        "Physics",
        "Engineering Mechanics",
        "English Communication",
      ],
      2: [
        "Mathematics II",
        "Chemistry",
        "Engineering Drawing",
        "Programming in C",
      ],
      3: [
        "Thermodynamics",
        "Strength of Materials",
        "Material Science",
        "Manufacturing Processes I",
      ],
      4: [
        "Fluid Mechanics",
        "Kinematics of Machines",
        "Manufacturing Processes II",
        "Heat Transfer",
      ],
      5: [
        "Machine Design I",
        "IC Engines",
        "Dynamics of Machines",
        "Industrial Engineering",
      ],
      6: [
        "Machine Design II",
        "Refrigeration & AC",
        "CAD/CAM",
        "Metrology & Quality Control",
      ],
      7: [
        "Automobile Engineering",
        "Power Plant Engineering",
        "Finite Element Analysis",
        "Robotics",
      ],
      8: [
        "Mechatronics",
        "Advanced Manufacturing",
        "Turbomachinery",
        "Project Work",
      ],
    },
  },
  {
    id: "civil",
    name: "Civil Engineering",
    shortName: "CE",
    icon: Building2,
    color: "#617073",
    semesters: {
      1: [
        "Mathematics I",
        "Physics",
        "Engineering Mechanics",
        "English Communication",
      ],
      2: ["Mathematics II", "Chemistry", "Engineering Drawing", "Surveying I"],
      3: [
        "Fluid Mechanics",
        "Strength of Materials",
        "Construction Materials",
        "Surveying II",
      ],
      4: [
        "Structural Analysis I",
        "Geotechnical Engineering I",
        "Hydraulic Engineering",
        "Concrete Technology",
      ],
      5: [
        "Structural Analysis II",
        "Geotechnical Engineering II",
        "Transportation Engineering",
        "Environmental Engineering I",
      ],
      6: [
        "Steel Structures",
        "Environmental Engineering II",
        "Foundation Engineering",
        "Estimation & Costing",
      ],
      7: [
        "Bridge Engineering",
        "Advanced Structural Design",
        "Water Resources Engineering",
        "Construction Management",
      ],
      8: [
        "Earthquake Engineering",
        "Green Building",
        "Urban Planning",
        "Project Work",
      ],
    },
  },
  {
    id: "physics",
    name: "Physics",
    shortName: "PHY",
    icon: Atom,
    color: "#92bcea",
    semesters: {
      1: [
        "Classical Mechanics",
        "Mathematical Physics I",
        "Optics",
        "Physics Lab I",
      ],
      2: [
        "Electrodynamics",
        "Mathematical Physics II",
        "Thermodynamics",
        "Physics Lab II",
      ],
      3: [
        "Quantum Mechanics I",
        "Statistical Mechanics",
        "Electronics",
        "Computational Physics",
      ],
      4: [
        "Quantum Mechanics II",
        "Solid State Physics",
        "Nuclear Physics I",
        "Spectroscopy",
      ],
      5: [
        "Nuclear Physics II",
        "Atomic & Molecular Physics",
        "Plasma Physics",
        "Advanced Lab I",
      ],
      6: [
        "Particle Physics",
        "Condensed Matter Physics",
        "Laser Physics",
        "Advanced Lab II",
      ],
      7: [
        "Astrophysics",
        "Nanoscience",
        "Advanced Quantum Mechanics",
        "Seminar",
      ],
      8: [
        "General Relativity",
        "Quantum Field Theory",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "chemistry",
    name: "Chemistry",
    shortName: "CHEM",
    icon: FlaskConical,
    color: "#afb3f7",
    semesters: {
      1: [
        "Inorganic Chemistry I",
        "Organic Chemistry I",
        "Physical Chemistry I",
        "Chemistry Lab I",
      ],
      2: [
        "Inorganic Chemistry II",
        "Organic Chemistry II",
        "Physical Chemistry II",
        "Chemistry Lab II",
      ],
      3: [
        "Coordination Chemistry",
        "Organic Reaction Mechanisms",
        "Chemical Thermodynamics",
        "Analytical Chemistry",
      ],
      4: [
        "Organometallic Chemistry",
        "Stereochemistry",
        "Electrochemistry",
        "Spectroscopy I",
      ],
      5: [
        "Bioinorganic Chemistry",
        "Heterocyclic Chemistry",
        "Chemical Kinetics",
        "Spectroscopy II",
      ],
      6: [
        "Materials Chemistry",
        "Natural Products",
        "Quantum Chemistry",
        "Environmental Chemistry",
      ],
      7: [
        "Polymer Chemistry",
        "Medicinal Chemistry",
        "Photochemistry",
        "Seminar",
      ],
      8: [
        "Supramolecular Chemistry",
        "Biochemistry",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "mathematics",
    name: "Mathematics",
    shortName: "MATH",
    icon: Calculator,
    color: "#7a93ac",
    semesters: {
      1: ["Calculus", "Analytical Geometry", "Classical Algebra", "Set Theory"],
      2: [
        "Real Analysis I",
        "Differential Equations",
        "Abstract Algebra I",
        "Number Theory",
      ],
      3: [
        "Real Analysis II",
        "Linear Algebra",
        "Abstract Algebra II",
        "Complex Analysis I",
      ],
      4: [
        "Complex Analysis II",
        "Numerical Methods",
        "Topology I",
        "Partial Differential Equations",
      ],
      5: [
        "Functional Analysis",
        "Discrete Mathematics",
        "Topology II",
        "Probability Theory",
      ],
      6: [
        "Measure Theory",
        "Operations Research",
        "Differential Geometry",
        "Mathematical Statistics",
      ],
      7: [
        "Algebraic Topology",
        "Fluid Dynamics",
        "Mathematical Modeling",
        "Seminar",
      ],
      8: [
        "Advanced Algebra",
        "Cryptography",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "english",
    name: "English",
    shortName: "ENG",
    icon: BookOpen,
    color: "#92bcea",
    semesters: {
      1: [
        "Introduction to Literature",
        "British Poetry I",
        "Grammar & Usage",
        "Communication Skills",
      ],
      2: [
        "British Poetry II",
        "British Drama I",
        "Phonetics & Phonology",
        "Academic Writing",
      ],
      3: [
        "British Literature",
        "American Literature I",
        "Linguistics I",
        "Literary Criticism I",
      ],
      4: [
        "American Literature II",
        "Indian Writing in English I",
        "Linguistics II",
        "Literary Criticism II",
      ],
      5: [
        "Postcolonial Literature",
        "Indian Writing in English II",
        "Modern Drama",
        "Stylistics",
      ],
      6: [
        "World Literature",
        "Literary Theory",
        "Creative Writing",
        "Women's Writing",
      ],
      7: [
        "New Literatures",
        "Translation Studies",
        "Cultural Studies",
        "Seminar",
      ],
      8: [
        "Comparative Literature",
        "Film Studies",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "bengali",
    name: "Bengali",
    shortName: "BEN",
    icon: Languages,
    color: "#afb3f7",
    semesters: {
      1: [
        "Bengali Poetry (Ancient)",
        "Bengali Prose (Medieval)",
        "Bengali Grammar I",
        "History of Bengali Literature I",
      ],
      2: [
        "Bengali Poetry (Medieval)",
        "Bengali Drama I",
        "Bengali Grammar II",
        "History of Bengali Literature II",
      ],
      3: [
        "Modern Bengali Poetry",
        "Bengali Short Stories",
        "Bengali Drama II",
        "Comparative Literature I",
      ],
      4: [
        "Rabindra Sahitya",
        "Bengali Novel I",
        "Bengali Linguistics",
        "Folklore Studies",
      ],
      5: [
        "Post-Tagore Poetry",
        "Bengali Novel II",
        "Modern Bengali Fiction",
        "Comparative Literature II",
      ],
      6: [
        "Bengali Essay & Criticism",
        "Children's Literature",
        "Translation Studies",
        "Bengali Periodicals",
      ],
      7: [
        "Contemporary Bengali Literature",
        "Assamese-Bengali Literary Relations",
        "Cultural Studies",
        "Seminar",
      ],
      8: [
        "Research Methodology",
        "Advanced Bengali Criticism",
        "Dissertation",
        "Viva Voce",
      ],
    },
  },
  {
    id: "political-science",
    name: "Political Science",
    shortName: "POL",
    icon: Landmark,
    color: "#617073",
    semesters: {
      1: [
        "Political Theory I",
        "Indian Government & Politics I",
        "Western Political Thought I",
        "Comparative Politics I",
      ],
      2: [
        "Political Theory II",
        "Indian Government & Politics II",
        "Western Political Thought II",
        "Comparative Politics II",
      ],
      3: [
        "International Relations I",
        "Public Administration I",
        "Indian Constitution",
        "Political Sociology I",
      ],
      4: [
        "International Relations II",
        "Public Administration II",
        "Indian Political Thought",
        "Political Sociology II",
      ],
      5: [
        "South Asian Politics",
        "International Law",
        "Human Rights",
        "Research Methods I",
      ],
      6: [
        "Foreign Policy of India",
        "International Organizations",
        "Governance & Development",
        "Research Methods II",
      ],
      7: [
        "Conflict & Peace Studies",
        "Gender & Politics",
        "Media & Politics",
        "Seminar",
      ],
      8: [
        "Northeast India Politics",
        "Contemporary Issues",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "economics",
    name: "Economics",
    shortName: "ECO",
    icon: TrendingUp,
    color: "#7a93ac",
    semesters: {
      1: [
        "Microeconomics I",
        "Indian Economy I",
        "Mathematical Economics I",
        "Statistics I",
      ],
      2: [
        "Microeconomics II",
        "Indian Economy II",
        "Mathematical Economics II",
        "Statistics II",
      ],
      3: [
        "Macroeconomics I",
        "International Economics I",
        "Public Finance I",
        "Econometrics I",
      ],
      4: [
        "Macroeconomics II",
        "International Economics II",
        "Public Finance II",
        "Econometrics II",
      ],
      5: [
        "Development Economics I",
        "Monetary Economics",
        "Agricultural Economics",
        "Environmental Economics",
      ],
      6: [
        "Development Economics II",
        "Industrial Economics",
        "Labour Economics",
        "Health Economics",
      ],
      7: [
        "Northeast India Economy",
        "Financial Economics",
        "Economics of Education",
        "Seminar",
      ],
      8: [
        "Advanced Econometrics",
        "Behavioral Economics",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "commerce",
    name: "Commerce",
    shortName: "COM",
    icon: Briefcase,
    color: "#92bcea",
    semesters: {
      1: [
        "Financial Accounting I",
        "Business Organization",
        "Business Mathematics",
        "Micro Economics",
      ],
      2: [
        "Financial Accounting II",
        "Business Law I",
        "Business Statistics",
        "Macro Economics",
      ],
      3: [
        "Cost Accounting I",
        "Business Law II",
        "Management Principles",
        "Indian Financial System",
      ],
      4: [
        "Cost Accounting II",
        "Corporate Law",
        "Marketing Management",
        "Income Tax Law I",
      ],
      5: [
        "Management Accounting",
        "Corporate Finance",
        "Auditing",
        "Income Tax Law II",
      ],
      6: [
        "Financial Management",
        "Human Resource Management",
        "Taxation",
        "E-Commerce",
      ],
      7: [
        "Strategic Management",
        "Banking & Insurance",
        "International Business",
        "Seminar",
      ],
      8: [
        "Entrepreneurship",
        "Business Analytics",
        "Research Methodology",
        "Project Work",
      ],
    },
  },
  {
    id: "biotechnology",
    name: "Biotechnology",
    shortName: "BIO",
    icon: Leaf,
    color: "#4ade80",
    semesters: {
      1: ["Cell Biology", "Biochemistry I", "Microbiology I", "Biostatistics"],
      2: ["Genetics", "Biochemistry II", "Microbiology II", "Biophysics"],
      3: ["Molecular Biology", "Immunology", "Enzymology", "Bioinformatics I"],
      4: [
        "Genetic Engineering",
        "Plant Biotechnology I",
        "Animal Biotechnology I",
        "Bioinformatics II",
      ],
      5: [
        "Plant Biotechnology II",
        "Animal Biotechnology II",
        "Fermentation Technology",
        "Bioprocess Engineering",
      ],
      6: [
        "Environmental Biotechnology",
        "Medical Biotechnology",
        "Genomics & Proteomics",
        "IPR & Bioethics",
      ],
      7: [
        "Nanobiotechnology",
        "Industrial Biotechnology",
        "Food Biotechnology",
        "Seminar",
      ],
      8: [
        "Pharmaceutical Biotechnology",
        "Agricultural Biotechnology",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
  {
    id: "environmental-science",
    name: "Environmental Science",
    shortName: "ENV",
    icon: Microscope,
    color: "#617073",
    semesters: {
      1: [
        "Fundamentals of Environment",
        "Ecology I",
        "Environmental Chemistry I",
        "Biostatistics",
      ],
      2: [
        "Ecology II",
        "Environmental Chemistry II",
        "Geology & Soil Science",
        "Environmental Biology",
      ],
      3: [
        "Pollution Control I",
        "Environmental Impact Assessment",
        "Wildlife Conservation",
        "Remote Sensing",
      ],
      4: [
        "Pollution Control II",
        "Climate Change",
        "Water Resource Management",
        "GIS Applications",
      ],
      5: [
        "Environmental Toxicology",
        "Disaster Management",
        "Environmental Law",
        "Waste Management",
      ],
      6: [
        "Environmental Biotechnology",
        "Energy & Environment",
        "Marine Environment",
        "Sustainable Development",
      ],
      7: [
        "Environmental Economics",
        "Forest Ecology",
        "Wetland Ecology",
        "Seminar",
      ],
      8: [
        "Advanced Environmental Monitoring",
        "Environmental Policy",
        "Research Methodology",
        "Dissertation",
      ],
    },
  },
];

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Initialize departments list with localStorage support
let _departments = [...departments];

const serializeDepartments = (depts) => {
  return depts.map((dept) => ({
    ...dept,
    iconName: dept.icon?.name || "Monitor", // Store icon name instead of component
  }));
};

const deserializeDepartments = (depts) => {
  return depts.map((dept) => {
    const iconName = dept.iconName || "Monitor";
    const { iconName: _, ...deptWithoutIconName } = dept;
    return {
      ...deptWithoutIconName,
      icon: ICON_MAP[iconName] || Monitor, // Restore icon component
    };
  });
};

const initializeDepartments = () => {
  try {
    const stored = localStorage.getItem("aus_vault_departments");
    if (stored) {
      const parsedDepts = JSON.parse(stored);
      _departments = deserializeDepartments(parsedDepts);
    } else {
      // First time: save default departments to localStorage
      localStorage.setItem(
        "aus_vault_departments",
        JSON.stringify(serializeDepartments(_departments)),
      );
    }
  } catch (e) {
    console.error("Error loading departments from localStorage:", e);
    _departments = [...departments];
  }
};

// Initialize on module load
if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  initializeDepartments();
}

// Helper to get all subjects across all semesters for a department (for backward compat)
export function getAllSubjects(dept) {
  if (!dept || !dept.semesters) return [];
  const all = new Set();
  Object.values(dept.semesters).forEach((subs) =>
    subs.forEach((s) => all.add(s)),
  );
  return [...all];
}

// Helper to get subjects for a specific semester
export function getSubjectsForSemester(dept, semester) {
  if (!dept || !dept.semesters) return [];
  return dept.semesters[semester] || [];
}

// Add a new department
export function addDepartment(newDept) {
  // Validate required fields
  if (!newDept.id || !newDept.name || !newDept.shortName) {
    throw new Error("Department must have id, name, and shortName");
  }

  // Check if department already exists
  if (_departments.some((d) => d.id === newDept.id)) {
    throw new Error("Department with this ID already exists");
  }

  // Set defaults for missing fields
  const dept = {
    icon: Monitor, // default icon
    color: "#92bcea", // default color
    semesters: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
    },
    ...newDept,
  };

  // Add to list
  _departments.push(dept);

  // Save to localStorage (with serialized icons)
  try {
    localStorage.setItem(
      "aus_vault_departments",
      JSON.stringify(serializeDepartments(_departments)),
    );
  } catch (e) {
    console.error("Error saving departments to localStorage:", e);
  }

  return dept;
}

// Get all departments
export function getDepartments() {
  return [..._departments];
}

// Default export returns the departments array with icons
// Make sure it always has proper icon components, not serialized versions
export default getDepartments();
