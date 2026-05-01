import { useState, useEffect } from "react";
import { getDepartments } from "../data/departments";

import { apiFetch } from "../api/api";

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
 * @param {string} deptId - Department ID to fetch semesters for (required)
 * @returns {Array} Array of semester numbers with live updates
 */
export function useSemesters(deptId) {
  const [semesters, setSemesters] = useState([]);

  const fetchSemesters = async () => {
    if (!deptId) return;

    try {
      const res = await apiFetch(`/department/list?id=${deptId}`, "GET");
      if (res.success && res.departments) {
        // Convert semester object keys to array of numbers
        const semesterKeys = Object.keys(res.departments.semesters || {});
        const semesterArray = semesterKeys.map(s => parseInt(s)).sort((a, b) => a - b);
        setSemesters(semesterArray);
      } else {
        setSemesters([]);
      }
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setSemesters([]);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, [deptId]);

  // Listen to semestersUpdated event to refetch
  useEffect(() => {
    const handleSemestersUpdate = () => {
      fetchSemesters();
    };

    window.addEventListener("semestersUpdated", handleSemestersUpdate);
    return () => {
      window.removeEventListener("semestersUpdated", handleSemestersUpdate);
    };
  }, [deptId]);

  return semesters;
}

/**
 * Custom hook to use approved papers with reactive updates
 * Automatically refetches papers when they change
 * @returns {Array} Array of approved question papers with live updates
 */
export function useApprovedPapers() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await apiFetch("/files/list", "GET");
        if (res.success && res.papers) {
          setPapers(res.papers);
        } else {
          setPapers([]);
        }
      } catch (err) {
        console.error("Error fetching approved papers:", err);
      }
    };

    fetchPapers();

    const handleStorageChange = () => {
      fetchPapers();
    };

    const handlePapersUpdate = () => {
      fetchPapers();
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
  // Now identical to useApprovedPapers since we only use real approved papers
  const papers = useApprovedPapers();
  return papers;
}

/**
 * Custom hook to get ALL papers with reactive updates and loading state.
 * @returns {Object} { papers: Array, loading: boolean }
 */
export function useAllPapersWithLoading() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/files/list", "GET");
        if (res.success && res.papers) {
          setPapers(res.papers);
        } else {
          setPapers([]);
        }
      } catch (err) {
        console.error("Error fetching approved papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();

    const handleStorageChange = () => fetchPapers();
    const handlePapersUpdate = () => fetchPapers();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("papersUpdated", handlePapersUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("papersUpdated", handlePapersUpdate);
    };
  }, []);

  return { papers, loading };
}
