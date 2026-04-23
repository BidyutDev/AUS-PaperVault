import { useState, useEffect } from "react";
import {
  MessageSquare,
  Trash2,
  Mail,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getFeedback, deleteFeedback } from "../../../data/feedback";
import { socket } from "../../../api/socket";
import ConfirmModal from "../ConfirmModal";
import "./FeedbackTab.css";

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await getFeedback() || [];
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

    // Listen for local window events
    window.addEventListener("feedbackUpdated", handleFeedbackUpdate);
    window.addEventListener("storage", handleFeedbackUpdate);

    // Listen for real-time socket events
    socket.on("feedback_list_updated", handleFeedbackUpdate);

    return () => {
      window.removeEventListener("feedbackUpdated", handleFeedbackUpdate);
      window.removeEventListener("storage", handleFeedbackUpdate);
      socket.off("feedback_list_updated", handleFeedbackUpdate);
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
      <div className="fb-tab-empty">
        <div className="fb-tab-empty-icon">
          <CheckCircle2 size={44} />
        </div>
        <h2 className="fb-tab-empty-title">Inbox Zero</h2>
        <p className="fb-tab-empty-sub">No feedback messages to display.</p>
      </div>
    );
  }

  return (
    <div className="fb-tab animate-slideUp">
      <ConfirmModal
        open={!!confirmDeleteId}
        title="Delete Feedback"
        message="Are you sure you want to permanently delete this feedback? This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <div className="fb-tab-header">
        <h2 className="fb-tab-title">
          <MessageSquare size={18} />
          User Feedback
        </h2>
        <span className="fb-tab-count">{feedbacks.length}</span>
      </div>

      <div className="fb-tab-list">
        {feedbacks.map((item) => (
          <div key={item._id} className="fb-card glass-card">
            <div className="fb-card-top">
              <div className="fb-card-meta">
                <div className="fb-card-user">
                  <User size={14} />
                  <strong>{item.username}</strong>
                </div>
                {item.email && (
                  <a href={`mailto:${item.email}`} className="fb-card-email">
                    <Mail size={13} />
                    {item.email}
                  </a>
                )}
              </div>
              <div className="fb-card-actions">
                <span className="fb-card-time">
                  <Clock size={12} />
                  {getTimeAgo(item.createdAt)}
                </span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="fb-card-delete"
                  title="Delete feedback"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="fb-card-message">
              {item.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
