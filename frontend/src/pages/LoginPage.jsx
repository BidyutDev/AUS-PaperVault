import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import "./LoginPage.css";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to intended page or home
  if (isLoggedIn) {
    const from = location.state?.from?.pathname || "/";
    navigate(from);
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email or username is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // Email validation (if input contains @)
    if (email.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address or username");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        login(email.trim(), password.trim());
        setIsLoading(false);
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      } catch (err) {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <motion.div
      className="login-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="login-container">
        <div className="login-card">
          {/* Card Header */}
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h1 className="login-title">Sign In to PaperVault</h1>
            <p className="login-subtitle">
              Access paper uploads and more features
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email/Username Field */}
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="your@email.com or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
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
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="login-footer">
            <p className="login-info">
              By signing in, you agree to contribute question papers following
              our community guidelines.
            </p>
            <p className="signup-prompt">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Side Decoration */}
        <div className="login-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </div>
    </motion.div>
  );
}
