import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "aus_vault_bookmarks";

const normalizeBookmarkId = (paperId) => String(paperId);

function parseStoredBookmarks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).map(normalizeBookmarkId) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

/**
 * Hook for managing bookmarked papers.
 * Stores paper IDs in localStorage.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(parseStoredBookmarks);

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
    const id = normalizeBookmarkId(paperId);
    setBookmarks((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveBookmarks(next);
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((paperId) => {
    const id = normalizeBookmarkId(paperId);
    setBookmarks((prev) => {
      const next = prev.filter((storedId) => storedId !== id);
      saveBookmarks(next);
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((paperId) => {
    const id = normalizeBookmarkId(paperId);
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((storedId) => storedId !== id)
        : [...prev, id];
      saveBookmarks(next);
      window.dispatchEvent(new Event("bookmarksUpdated"));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (paperId) => bookmarks.includes(normalizeBookmarkId(paperId)),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked };
}
