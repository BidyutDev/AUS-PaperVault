import { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Trash2,
  Mail,
  User,
  Clock,
  Inbox,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getFeedback, deleteFeedback } from "../../../data/feedback";
import { socket } from "../../../api/socket";
import ConfirmModal from "../ConfirmModal";
import "./FeedbackTab.css";

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = (await getFeedback()) || [];
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const handleFeedbackUpdate = async () => {
      const feedbackList = await getFeedback();
      setFeedbacks(feedbackList);
    };

    const interval = setInterval(() => setNow(Date.now()), 60000);

    window.addEventListener("feedbackUpdated", handleFeedbackUpdate);
    window.addEventListener("storage", handleFeedbackUpdate);
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

  // Filter and Sort Logic
  const filteredFeedbacks = useMemo(() => {
    let result = feedbacks.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.username?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query)
      );
    });

    return result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [feedbacks, searchQuery, sortOrder]);

  if (feedbacks.length === 0) {
    return (
      <div className="fb-tab-empty-container">
        <div className="fb-tab-empty">
          <div className="fb-tab-empty-glow" />
          <div className="fb-tab-empty-icon">
            <Inbox size={40} strokeWidth={1.5} />
          </div>
          <h2 className="fb-tab-empty-title">Inbox Zero</h2>
          <p className="fb-tab-empty-sub">
            No feedback messages yet. New submissions will appear here in
            real-time.
          </p>
        </div>
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
        <div className="fb-tab-header-left">
          <h2 className="fb-tab-title">
            <MessageSquare size={18} />
            User Feedback
          </h2>
          <span className="fb-tab-count">{feedbacks.length}</span>
        </div>

        <div className="fb-tab-controls">
          <div className="fb-search-box">
            <Search size={14} className="fb-search-icon" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="fb-search-input"
            />
          </div>
          <button 
            className="fb-sort-btn"
            onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
            title={`Sort by: ${sortOrder === "newest" ? "Newest" : "Oldest"}`}
          >
            <ArrowUpDown size={14} />
            <span className="fb-sort-text">{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </button>
        </div>
      </div>

      <div className="fb-tab-list">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((item, index) => (
            <div
              key={item._id}
              className="fb-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="fb-card-top">
                <div className="fb-card-meta">
                  <div className="fb-card-avatar">
                    {item.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="fb-card-info">
                    <strong className="fb-card-username">{item.username}</strong>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="fb-card-email">
                        <Mail size={11} />
                        {item.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="fb-card-actions">
                  <span className="fb-card-time">
                    <Clock size={11} />
                    {getTimeAgo(item.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="fb-card-delete"
                    title="Delete feedback"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="fb-card-message">{item.message}</div>
            </div>
          ))
        ) : (
          <div className="fb-no-results">
            <Filter size={24} />
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
