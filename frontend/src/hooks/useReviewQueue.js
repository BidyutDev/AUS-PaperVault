import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/api";

/**
 * Custom hook to manage the review queue.
 * Communicates with the backend endpoints:
 *   GET  /files/pending            → fetch pending files
 *   POST /files/action/approve/:id → approve a file
 *   POST /files/action/reject/:id  → reject (delete) a file
 */
export default function useReviewQueue() {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  /* ── Fetch pending files ──────────────────────────────── */
  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/files/pending", "GET", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setPendingFiles(res.pendingFiles ?? []);
      } else {
        setError(res.message || "Failed to fetch pending files");
        setPendingFiles([]);
      }
    } catch (err) {
      setError(err.message || "Network error");
      setPendingFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  /* ── Show toast feedback, auto-dismiss ────────────────── */
  const showFeedback = useCallback((type, message) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 2500);
  }, []);

  /* ── Approve a file ───────────────────────────────────── */
  const approveFile = useCallback(
    async (fileId) => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await apiFetch(`/files/action/approve/${fileId}`, "POST", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          showFeedback("approved", "Paper approved & published");
          // Remove the file from local state immediately
          setPendingFiles((prev) => prev.filter((f) => f._id !== fileId));
        } else {
          showFeedback("error", res.message || "Approval failed");
        }
        return res.success;
      } catch (err) {
        showFeedback("error", err.message || "Approval failed");
        return false;
      }
    },
    [showFeedback]
  );

  /* ── Reject a file ────────────────────────────────────── */
  const rejectFile = useCallback(
    async (fileId) => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await apiFetch(`/files/action/reject/${fileId}`, "POST", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          showFeedback("rejected", "Paper rejected & removed");
          setPendingFiles((prev) => prev.filter((f) => f._id !== fileId));
        } else {
          showFeedback("error", res.message || "Rejection failed");
        }
        return res.success;
      } catch (err) {
        showFeedback("error", err.message || "Rejection failed");
        return false;
      }
    },
    [showFeedback]
  );

  /* ── Update file tags ─────────────────────────────────── */
  const updateFileTags = useCallback(
    async (fileId, data) => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await apiFetch(`/files/update/${fileId}`, "PUT", {
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });

        if (res.success) {
          showFeedback("approved", "File tags updated");
          // Update the file in local state
          setPendingFiles((prev) =>
            prev.map((f) => (f._id === fileId ? { ...f, ...data } : f))
          );
        } else {
          showFeedback("error", res.message || "Update failed");
        }
        return res.success;
      } catch (err) {
        showFeedback("error", err.message || "Update failed");
        return false;
      }
    },
    [showFeedback]
  );

  return {
    pendingFiles,
    isLoading,
    error,
    actionFeedback,
    fetchPending,
    approveFile,
    rejectFile,
    updateFileTags,
  };
}
