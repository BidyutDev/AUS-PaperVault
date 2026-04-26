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
  GraduationCap,
  Scale,
  Stethoscope,
  Globe,
  PenTool,
  Music,
  Palette,
  HeartPulse,
  Bug,
  Mountain,
  Newspaper,
  ScrollText,
  Workflow,
  Database,
  Radio,
  ShieldCheck,
  Users,
  Wrench,
  Sigma,
  Dna,
  TreePine,
  Fish,
  Gem,
} from "lucide-react";
import { apiFetch } from "../api/api";

// Icon mapping for converting icon names to components
const ICON_MAP = {
  Monitor,       // Computer Science
  Cpu,           // Electronics / IT
  Zap,           // Electrical Engineering
  Cog,           // Mechanical Engineering
  Building2,     // Civil Engineering
  Atom,          // Physics
  FlaskConical,  // Chemistry
  Calculator,    // Mathematics
  BookOpen,      // Education / General Studies
  Languages,     // Linguistics / Language Departments
  Landmark,      // Political Science / History
  TrendingUp,    // Economics / Commerce
  Briefcase,     // Business Administration / MBA
  Leaf,          // Botany / Environmental Science
  Microscope,    // Zoology / Life Sciences
  GraduationCap, // Education / Academic Affairs
  Scale,         // Law
  Stethoscope,   // Pharmacy / Medical Sciences
  Globe,         // Geography
  PenTool,       // English / Literature / Fine Arts
  Music,         // Performing Arts / Music
  Palette,       // Visual Arts / Design
  HeartPulse,    // Biotechnology / Biomedical
  Bug,           // Entomology / Applied Biology
  Mountain,      // Geology / Earth Sciences
  Newspaper,     // Mass Communication / Journalism
  ScrollText,    // Sanskrit / Hindi / Classical Languages
  Workflow,      // Management Studies
  Database,      // Information Technology
  Radio,         // Electronics & Communication
  ShieldCheck,   // Defence Studies
  Users,         // Sociology / Social Work
  Wrench,        // Applied Engineering
  Sigma,         // Statistics
  Dna,           // Genetics / Molecular Biology
  TreePine,      // Forestry / Ecology
  Fish,          // Aquaculture / Marine Biology
  Gem,           // Material Science
};

// Export list of available icon names for forms/selection
export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

// Export the ICON_MAP itself for the icon picker
export { ICON_MAP };

/**
 * Predefined icon suggestions for common Assam University departments.
 * Maps lowercase keywords found in department names to the best-fit icon.
 * Used by the admin icon picker to auto-suggest an icon.
 */
export const DEPARTMENT_ICON_PRESETS = {
  "computer science": "Monitor",
  "cse": "Monitor",
  "information technology": "Database",
  "it": "Database",
  "electronics": "Cpu",
  "ece": "Radio",
  "electrical": "Zap",
  "eee": "Zap",
  "mechanical": "Cog",
  "civil": "Building2",
  "physics": "Atom",
  "chemistry": "FlaskConical",
  "mathematics": "Calculator",
  "statistics": "Sigma",
  "english": "PenTool",
  "hindi": "ScrollText",
  "sanskrit": "ScrollText",
  "bengali": "Languages",
  "assamese": "Languages",
  "linguistics": "Languages",
  "education": "GraduationCap",
  "law": "Scale",
  "political science": "Landmark",
  "history": "Landmark",
  "economics": "TrendingUp",
  "commerce": "TrendingUp",
  "business": "Briefcase",
  "mba": "Briefcase",
  "management": "Workflow",
  "botany": "Leaf",
  "zoology": "Microscope",
  "life science": "Microscope",
  "biotechnology": "HeartPulse",
  "biotech": "HeartPulse",
  "pharmacy": "Stethoscope",
  "geography": "Globe",
  "geology": "Mountain",
  "earth science": "Mountain",
  "environmental": "TreePine",
  "ecology": "TreePine",
  "forestry": "TreePine",
  "mass communication": "Newspaper",
  "journalism": "Newspaper",
  "sociology": "Users",
  "social work": "Users",
  "anthropology": "Users",
  "music": "Music",
  "fine arts": "Palette",
  "visual arts": "Palette",
  "performing arts": "Music",
  "defence": "ShieldCheck",
  "molecular biology": "Dna",
  "genetics": "Dna",
  "aquaculture": "Fish",
  "marine": "Fish",
  "material science": "Gem",
  "applied": "Wrench",
  "entomology": "Bug",
};

// Subjects are organized per semester so that different semesters
// show their own unique subject lists.

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

// Helper function to add icon to department from API
// Converts iconName string from backend to actual icon component
// Defaults to Monitor if no icon is provided
const addIconToDepartment = (dept) => {
  // Get icon name from backend, default to "Monitor"
  const iconName = dept.iconName || "Monitor";

  // Convert icon name to component, fallback to Monitor if not found
  const icon = ICON_MAP[iconName] || Monitor;

  // Use color from backend (with default fallback)
  const color = dept.color || "#000";

  return {
    ...dept,
    icon,
    color,
    // For compatibility with components expecting these fields
    name: dept.fullName,
    id: dept._id || dept.shortName?.toLowerCase(),
  };
};

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
export async function addDepartment(newDept) {
  try {
    // Validate required fields
    if (!newDept.fullName || !newDept.shortName) {
      throw new Error("Department must have fullName and shortName");
    }

    // Validate icon name if provided
    if (newDept.iconName && !AVAILABLE_ICONS.includes(newDept.iconName)) {
      throw new Error("Invalid icon name");
    }
    const semesters = {};
    for (let i = 1; i <= newDept.semesterCount; i++) {
      semesters[String(i)] = [];
    }
    const res = await apiFetch("/department/add", "POST", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: {
        fullName: newDept.fullName,
        shortName: newDept.shortName,
        semesters: semesters,
        color: newDept.color || "#000",
        iconName: newDept.iconName || "Monitor", // Default to Monitor
        years: [],
      },
    });

    if (res.success) {
      // Dispatch event to refresh departments in hooks
      window.dispatchEvent(new Event("departmentsUpdated"));
    }

    return res.success;
  } catch (e) {
    console.error("Error adding department:", e);
    return false;
  }
}

// Delete a department by ID
export async function deleteDepartment(deptId) {
  try {
    const res = await apiFetch(`/department/delete/${deptId}`, "DELETE", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (res.success) {
      // Dispatch event to refresh departments in hooks
      window.dispatchEvent(new Event("departmentsUpdated"));
    }

    return res.success;
  } catch (e) {
    console.error("Error deleting department:", e);
    return false;
  }
}

// Update a department
export async function updateDepartment(deptId, updates) {
  try {
    // Validate required fields if provided
    if (updates.fullName === "" || updates.shortName === "") {
      throw new Error("Department must have fullName and shortName");
    }

    if (
      updates.years &&
      (!Array.isArray(updates.years) || updates.years.length === 0)
    ) {
      throw new Error("Department must have years array");
    }

    // Validate icon name if provided
    if (updates.iconName && !AVAILABLE_ICONS.includes(updates.iconName)) {
      throw new Error("Invalid icon name");
    }

    const res = await apiFetch(`/department/update/${deptId}`, "PUT", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: {
        fullName: updates.fullName,
        shortName: updates.shortName,
        semesters: updates.semesters || {},
        color: updates.color || "#000",
        iconName: updates.iconName || "Monitor",
        years: updates.years || [],
      },
    });

    if (res.success) {
      // Dispatch event to refresh departments in hooks
      window.dispatchEvent(new Event("departmentsUpdated"));
    }

    return res.success;
  } catch (e) {
    console.error("Error updating department:", e);
    return false;
  }
}

// Fetch all departments from backend API with icons
export async function getDepartments() {
  try {
    const res = await apiFetch("/department/list", "GET", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (res.success && res.departments && Array.isArray(res.departments)) {
      // Add icons to departments fetched from API
      return res.departments.map(addIconToDepartment);
    }

    console.warn("No departments found in API response:", res);
    return [];
  } catch (err) {
    console.error("Error fetching departments from API:", err);
    return [];
  }
}

// Default export returns the departments array with icons
// Make sure it always has proper icon components, not serialized versions
export default getDepartments;
