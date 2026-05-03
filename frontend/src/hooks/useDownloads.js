import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aus_vault_downloads";

function getStoredDownloads() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Hook for tracking download counts per paper.
 * Stores { paperId: count } in localStorage.
 */
export function useDownloads() {
  const [downloads, setDownloads] = useState(getStoredDownloads);

  useEffect(() => {
    const handleStorage = () => setDownloads(getStoredDownloads());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("downloadsUpdated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("downloadsUpdated", handleStorage);
    };
  }, []);

  const incrementDownload = useCallback((paperId) => {
    // Optimistic local update
    setDownloads((prev) => {
      const next = { ...prev, [paperId]: (prev[paperId] || 0) + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("downloadsUpdated"));
      return next;
    });

    // Notify backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/files/download/${paperId}`, {
      method: "POST",
    }).catch(err => console.error("Failed to increment download count on server:", err));
  }, []);

  const getDownloadCount = useCallback(
    (paperId) => downloads[paperId] || 0,
    [downloads]
  );

  return { downloads, incrementDownload, getDownloadCount };
}
