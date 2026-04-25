import { useState, useEffect } from "react";
import { getDepartments, SEMESTERS } from "../data/departments";
import { getApprovedPapers, getAllPapers } from "../data/mockPapers";

/**
 * Custom hook to fetch and manage departments from backend API
 * Automatically refetches departments when they change
 * @returns {Object} { departments: Array, loading: boolean, error: string|null }
 */
export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const depts = await getDepartments();
      setDepartments(depts || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.message || "Failed to fetch departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Listen for department updates from other components
  useEffect(() => {
    const handleDepartmentsUpdate = () => {
      fetchDepartments();
    };

    window.addEventListener("departmentsUpdated", handleDepartmentsUpdate);

    return () => {
      window.removeEventListener("departmentsUpdated", handleDepartmentsUpdate);
    };
  }, []);

  return { departments, loading, error };
}

/**
 * Get a specific department by ID with reactive updates
 * @param {string} deptId - Department ID to find
 * @returns {Object|null|undefined} Department object, null if not found, or undefined if loading
 */
export function useDepartment(deptId) {
  const { departments, loading } = useDepartments();
  
  // Return undefined while loading so component can show loading state
  if (loading) return undefined;
  
  // Try to find by _id or id or shortName
  return departments.find((d) => 
    d._id === deptId || 
    d.id === deptId || 
    d.shortName?.toLowerCase() === deptId?.toLowerCase()
  ) || null;
}

/**
 * Custom hook to use semesters with reactive updates
 * Automatically refetches semesters when they change
 * @returns {Array} Array of semester numbers with live updates
 */
export function useSemesters() {
  const [semesters, setSemesters] = useState(() => SEMESTERS);

  useEffect(() => {
    const handleSemestersUpdate = () => {
      setSemesters(SEMESTERS);
    };

    // Listen to custom event from admin panel (same-tab updates)
    window.addEventListener("semestersUpdated", handleSemestersUpdate);

    return () => {
      window.removeEventListener("semestersUpdated", handleSemestersUpdate);
    };
  }, []);

  return semesters;
}

/**
 * Custom hook to use approved papers with reactive updates
 * Automatically refetches papers when they change
 * @returns {Array} Array of approved question papers with live updates
 */
export function useApprovedPapers() {
  const [papers, setPapers] = useState(() => getApprovedPapers());

  useEffect(() => {
    const handleStorageChange = () => {
      setPapers(getApprovedPapers());
    };

    const handlePapersUpdate = () => {
      setPapers(getApprovedPapers());
    };

    // Listen to storage changes from other tabs/windows
    window.addEventListener("storage", handleStorageChange);
    // Listen to custom event from admin panel (same-tab updates)
    window.addEventListener("papersUpdated", handlePapersUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("papersUpdated", handlePapersUpdate);
    };
  }, []);

  return papers;
}

/**
 * Custom hook to get ALL papers (mock + approved - deleted) with reactive updates.
 * Re-fetches whenever papers are added, approved, or deleted.
 * @returns {Array} Array of all active question papers with live updates
 */
export function useAllPapers() {
  const [papers, setPapers] = useState(() => getAllPapers());

  useEffect(() => {
    const refresh = () => setPapers(getAllPapers());

    window.addEventListener("storage", refresh);
    window.addEventListener("papersUpdated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("papersUpdated", refresh);
    };
  }, []);

  return papers;
}
