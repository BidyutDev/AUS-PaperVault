import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, AlertTriangle, Eye, EyeOff, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import "./DeleteAccountPage.css";
import { BASE_URL } from "../api/api";

export default function DeleteAccountPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to home
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Password is required to delete your account");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/user/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Account deleted, trigger logout
        logout();
        navigate("/");
      } else {
        setShowConfirmModal(false);
        setError(data.message || "Failed to delete account");
      }
    } catch (err) {
      setShowConfirmModal(false);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="delete-acc-container">
        <div className="delete-acc-card">
          {/* Card Header */}
          <div className="delete-acc-header">
            <div className="delete-acc-icon">
              <AlertTriangle size={32} />
            </div>
            <h1 className="delete-acc-title">Delete Account</h1>
            <p className="delete-acc-subtitle">
              Warning: This action is permanent and cannot be undone. All your uploaded papers and bookmarks will be anonymized.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleInitialSubmit} className="delete-acc-form">
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password to continue"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button type="submit" className="delete-acc-button" disabled={isLoading || !password.trim()}>
              <Trash2 size={16} />
              <span>Proceed</span>
            </button>
            
            <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="delete-confirm-overlay">
            <motion.div 
              className="delete-confirm-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button 
                className="close-modal-btn"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                <X size={18} />
              </button>
              
              <div className="confirm-modal-icon">
                <AlertTriangle size={40} />
              </div>
              
              <h2>Are you absolutely sure?</h2>
              <p>
                This will permanently delete your account (<strong>{user?.username}</strong>) and remove your data from our servers. 
                This action cannot be reversed.
              </p>
              
              <div className="confirm-modal-actions">
                <button 
                  className="modal-cancel-btn"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  className="modal-delete-btn"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Yes, delete my account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
