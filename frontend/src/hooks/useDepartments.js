import { useState, useEffect, useCallback } from "react";
import { getDepartments } from "../data/departments";

/**
 * Custom hook to use departments with reactive updates
 * Automatically refetches departments when they change in localStorage
 * @returns {Array} Array of department objects with live updates
 */
export function useDepartments() {
  const [departments, setDepartments] = useState(() => getDepartments());

  // Listen for storage changes (from other tabs/windows or the admin panel)
  useEffect(() => {
    const handleStorageChange = () => {
      setDepartments(getDepartments());
    };

    const handleDepartmentsUpdate = () => {
      setDepartments(getDepartments());
    };

    // Listen to storage changes from other components/tabs
    window.addEventListener("storage", handleStorageChange);
    // Listen to custom event from admin panel (same-tab updates)
    window.addEventListener("departmentsUpdated", handleDepartmentsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("departmentsUpdated", handleDepartmentsUpdate);
    };
  }, []);

  return departments;
}

/**
 * Get a specific department by ID with reactive updates
 * @param {string} deptId - Department ID to find
 * @returns {Object|null} Department object or null if not found
 */
export function useDepartment(deptId) {
  const allDepartments = useDepartments();
  return allDepartments.find((d) => d.id === deptId) || null;
}
