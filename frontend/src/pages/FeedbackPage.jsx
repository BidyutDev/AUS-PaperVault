import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  LogIn,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { notifyFeedbackSubmitted } from "../data/adminNotifications";
import { pageVariants, pageTransition } from "../lib/animations";
import "./FeedbackPage.css";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);



  useEffect(() => {
    const fetchMyFeedback = async () => {
      if (!user) {
        setLoadingInitial(false);
        return;
      }
      try {
        const token = localStorage.getItem("access_token");
        const data = await apiFetch("/feedback/me", "GET", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (data.success && data.feedback) {
          setMessage(data.feedback.message);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchMyFeedback();
  }, [user]);

  if (!user) {
    return (
      <motion.div
        className="page-enter"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="container-vault feedback-wrapper">
          <div
            className="feedback-success glass-card"
            style={{ textAlign: "center" }}
          >
            <div
              className="feedback-success-icon"
              style={{ color: "var(--color-vault-lavender)" }}
            >
              <LogIn size={48} />
            </div>
            <h2 className="feedback-success-title">Sign In Required</h2>
            <p className="feedback-success-text">
              You need to be signed in to submit feedback. Please log in or
              create an account first.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <Link to="/login" className="btn-cyber-solid">
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn-cyber-solid"
                style={{ border: "1px solid rgba(175, 179, 247, 0.3)" }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!message) return;

      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      const endpoint = isEditing ? "/feedback/edit" : "/feedback/send";
      const payload = isEditing ? { editedMessage: message } : { message };

      const data = await apiFetch(endpoint, "POST", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!data.success) {
        setError("Error in sending feedback");
        toast.error("Failed to send feedback", {
          description: "There was a problem sending your feedback. Please try again."
        });
        setSubmitting(false);
        return;
      }

      if (!isEditing) {
        notifyFeedbackSubmitted({
          name: data.username?.trim() || user?.username || "Anonymous",
          preview: message,
        });
      }

      window.dispatchEvent(new Event("feedbackUpdated"));
      setSubmitting(false);
      setSubmitted(true);
      toast.success(isEditing ? "Feedback Updated" : "Feedback target secured", {
        description: isEditing ? "Your message has been updated." : "Your message has been delivered to the dev team."
      });
      if (!isEditing) {
        setIsEditing(true);
      }
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
      toast.error("Transmission failed", {
        description: err.message
      });
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="page-enter"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container-vault feedback-wrapper">
          <div className="feedback-success glass-card">
            <div className="feedback-success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="feedback-success-title">Thank You!</h2>
            <p className="feedback-success-text">
              We appreciate your feedback. It helps us make AUS PaperVault
              better for everyone.
            </p>
            {isEditing && (
              <p className="feedback-success-text" style={{ fontSize: '0.8rem', color: 'var(--color-vault-steel)' }}>
                Your feedback has been successfully updated.
              </p>
            )}
            <button
              className="btn-cyber-solid mt-4"
              onClick={() => setSubmitted(false)}
            >
              {isEditing ? "Edit Feedback" : "Go Back"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page-enter"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container-vault feedback-wrapper">
        <div className="feedback-title-section">
          <div className="feedback-badge">
            <MessageSquare size={14} />
            Feedback
          </div>
          <h1 className="feedback-title">{isEditing ? "Your Active Feedback" : "We Value Your Input"}</h1>
          <p className="feedback-subtitle">
            {isEditing 
              ? "You already have an active feedback in the queue. You can review or edit it below." 
              : "Found a bug? Have a suggestion? Let us know how we can improve."}
          </p>
        </div>

        {isEditing && !showEditForm ? (
          <div className="feedback-readonly-card glass-card">
            <div className="feedback-readonly-header">
              <span className="feedback-readonly-label">
                <MessageSquare size={12} />
                Your Message
              </span>
              <button
                onClick={() => setShowEditForm(true)}
                className="feedback-edit-btn"
                title="Edit Feedback"
              >
                <Edit2 size={13} />
                Edit
              </button>
            </div>
            <div className="feedback-readonly-box">
              {message}
            </div>
            <div className="feedback-pending-badge">
              <AlertCircle size={13} />
              Pending admin review
            </div>
          </div>
        ) : (
          <form className="feedback-form glass-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {isEditing ? "Edit Your Message" : "Your Message"} *
              </label>
              <textarea
                className="input-cyber"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind? Share a bug, suggestion, or anything else..."
                rows="6"
                required
                style={{ resize: "vertical", minHeight: "120px" }}
              />
            </div>

            <div className="feedback-submit-row">
              <div className="feedback-notice">
                <AlertCircle size={14} />
                We read every submission.
              </div>
              <div className="feedback-btn-group">
                {isEditing && (
                  <button
                    type="button"
                    className="btn-cyber"
                    onClick={() => setShowEditForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-cyber-solid"
                  disabled={submitting || !message || loadingInitial}
                  style={{ opacity: submitting || !message || loadingInitial ? 0.5 : 1 }}
                >
                  <Send size={14} />
                  {submitting ? "Sending..." : (isEditing ? "Update Feedback" : "Send Feedback")}
                </button>
              </div>
            </div>

            {error && (
              <div className="feedback-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </motion.div>
  );
}
