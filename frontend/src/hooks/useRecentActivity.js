import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aus_recent_activity";
const MAX_ITEMS = 8;

/**
 * Returns a de-duplicated, time-sorted list of recent activity entries
 * and helpers to add / clear entries.
 *
 * Entry shape:
 * {
 *   type: "department" | "subject",
 *   departmentName: string,
 *   departmentShort: string,
 *   departmentId: string,
 *   subject?: string,
 *   semester?: number,
 *   timestamp: number,
 *   color?: string,
 * }
 */
export function useRecentActivity() {
  const read = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [activities, setActivities] = useState(read);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setActivities(read());
    };
    const onCustom = () => setActivities(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("recentActivityUpdated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("recentActivityUpdated", onCustom);
    };
  }, []);

  const addActivity = useCallback((entry) => {
    const prev = read();
    // Remove duplicate (same type + dept + subject)
    const deduped = prev.filter((a) => {
      if (a.type !== entry.type) return true;
      if (entry.type === "department") return a.departmentId !== entry.departmentId;
      // subject type: match dept + subject
      return !(a.departmentId === entry.departmentId && a.subject === entry.subject);
    });
    const next = [{ ...entry, timestamp: Date.now() }, ...deduped].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActivities(next);
    window.dispatchEvent(new Event("recentActivityUpdated"));
  }, []);

  const clearActivity = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setActivities([]);
    window.dispatchEvent(new Event("recentActivityUpdated"));
  }, []);

  return { activities, addActivity, clearActivity };
}
