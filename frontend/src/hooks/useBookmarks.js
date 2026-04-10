import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aus_vault_bookmarks";

function getStoredBookmarks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Hook for managing bookmarked papers.
 * Stores paper IDs in localStorage.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(getStoredBookmarks);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = () => setBookmarks(getStoredBookmarks());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("bookmarksUpdated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bookmarksUpdated", handleStorage);
    };
  }, []);

  const addBookmark = useCallback((paperId) => {
    setBookmarks((prev) => {
      if (prev.includes(paperId)) return prev;
      const next = [...prev, paperId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((paperId) => {
    setBookmarks((prev) => {
      const next = prev.filter((id) => id !== paperId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((paperId) => {
    setBookmarks((prev) => {
      const next = prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (paperId) => bookmarks.includes(paperId),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked };
}
