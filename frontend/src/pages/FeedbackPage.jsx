import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, LogIn, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { notifyFeedbackSubmitted } from "../data/adminNotifications";
import "./FeedbackPage.css";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function FeedbackPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
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
          <div className="feedback-success glass-card" style={{ textAlign: "center" }}>
            <div className="feedback-success-icon" style={{ color: "var(--color-vault-lavender)" }}>
              <LogIn size={48} />
            </div>
            <h2 className="feedback-success-title">Sign In Required</h2>
            <p className="feedback-success-text">
              You need to be signed in to submit feedback. Please log in or create an account first.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <Link to="/login" className="btn-cyber-solid">
                Log In
              </Link>
              <Link to="/signup" className="btn-cyber-solid" style={{ border: "1px solid rgba(175, 179, 247, 0.3)" }}>
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

      const data = await apiFetch("/feedback/send", "POST", {
        body: {
          name,
          email,
          message,
        },
      });
      if (!data.success) {
        setError("Error in sending feedback");
        setSubmitting(false);
        return;
      }
      notifyFeedbackSubmitted({
        name: name?.trim() || "Anonymous",
        preview: message,
      });
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message);
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
            <button
              className="btn-cyber-solid mt-4"
              onClick={() => setSubmitted(false)}
            >
              Submit Another Response
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
          <h1 className="feedback-title">We Value Your Input</h1>
          <p className="feedback-subtitle">
            Found a bug? Have a suggestion? Let us know how we can improve.
          </p>
        </div>

        <form className="feedback-form glass-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="feedback-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="feedback-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="We'll only use this to reply back"
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              className="input-cyber"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows="5"
              required
              style={{ resize: "vertical", minHeight: "100px" }}
            />
          </div>

          <div className="feedback-submit-row">
            <div className="feedback-notice">
              <AlertCircle size={14} />
              We read every submission.
            </div>
            <button
              type="submit"
              className="btn-cyber-solid"
              disabled={submitting || !message}
              style={{ opacity: submitting || !message ? 0.5 : 1 }}
            >
              <Send size={14} />
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>

          {error && (
            <div className="feedback-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
