import { useState, useEffect } from "react";
import {
  MessageSquare,
  Trash2,
  Mail,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getFeedback, deleteFeedback } from "../../../data/feedback";
import ConfirmModal from "../ConfirmModal";

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await getFeedback();
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const handleFeedbackUpdate = async () => {
      const feedbackList = await getFeedback();
      setFeedbacks(feedbackList);
    };

    // Update timestamps periodically
    const interval = setInterval(() => setNow(Date.now()), 60000);

    window.addEventListener("feedbackUpdated", handleFeedbackUpdate);
    window.addEventListener("storage", handleFeedbackUpdate); // in case added from same browser different tab

    return () => {
      window.removeEventListener("feedbackUpdated", handleFeedbackUpdate);
      window.removeEventListener("storage", handleFeedbackUpdate);
      clearInterval(interval);
    };
  }, []);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (confirmDeleteId) {
      await deleteFeedback(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  if (feedbacks.length === 0) {
    return (
      <div
        className="admin-empty-state"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="admin-empty-icon" style={{ marginBottom: "1rem" }}>
          <CheckCircle2 size={48} />
        </div>
        <h2 className="admin-empty-title">Inbox Zero</h2>
        <p className="admin-empty-sub">No feedback messages to display.</p>
      </div>
    );
  }

  return (
    <div
      className="admin-analytics-section animate-slideUp"
      style={{ padding: "2rem", height: "100%", overflowY: "auto" }}
    >
      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete Feedback"
        message="Are you sure you want to permanently delete this feedback? This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <h2 className="admin-departments-title" style={{ marginBottom: "2rem" }}>
        User_Feedback
        <MessageSquare
          size={18}
          style={{
            display: "inline",
            marginLeft: "0.5rem",
            color: "var(--color-vault-lavender)",
          }}
        />
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {feedbacks.map((item) => (
          <div
            key={item._id}
            className="glass-card"
            style={{ padding: "1.5rem", position: "relative" }}
          >
            <button
              onClick={() => handleDelete(item._id)}
              className="admin-dept-card-delete"
              title="Delete feedback"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 1,
                zIndex: 10,
                background: "rgba(248, 113, 113, 0.1)",
                border: "1px solid rgba(248, 113, 113, 0.3)",
                color: "var(--color-vault-danger)",
                padding: "0.4rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={14} />
            </button>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
                paddingRight: "3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--color-vault-light)",
                }}
              >
                <User size={14} color="var(--color-vault-steel)" />
                <strong>{item.username}</strong>
              </div>
              {item.email && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--color-vault-lavender)",
                  }}
                >
                  <Mail size={14} color="var(--color-vault-steel)" />
                  <a
                    href={`mailto:${item.email}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {item.email}
                  </a>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--color-vault-steel)",
                  fontSize: "0.85rem",
                  marginLeft: "auto",
                }}
              >
                <Clock size={12} />
                {getTimeAgo(item.createdAt)}
              </div>
            </div>

            <div
              style={{
                background: "rgba(0, 20, 40, 0.3)",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(175, 179, 247, 0.1)",
                color: "var(--color-vault-light)",
                fontFamily: "var(--font-primary)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {item.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
