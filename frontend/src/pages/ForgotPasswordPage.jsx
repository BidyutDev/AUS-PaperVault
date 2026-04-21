import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import { apiFetch } from "../api/api";
import "./ForgotPasswordPage.css";

/* ── Constants ───────────────────────────────────────────── */
const OTP_LENGTH = 6;
const COOLDOWN_SECONDS = 60;

/* ── Step enum ───────────────────────────────────────────── */
const STEP = {
  EMAIL: "email",
  OTP: "otp",
  NEW_PASSWORD: "new_password",
  SUCCESS: "success",
};

/* ── Slide animation variants ────────────────────────────── */
const slideVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function ForgotPasswordPage() {
  const { isLoggedIn } = useAuth();

  // ── multi-step state
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── feedback state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ── refs for OTP input auto-focus
  const otpRefs = useRef([]);

  // If already logged in, redirect home
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  /* ── Cooldown timer ────────────────────────────────────── */
  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── Step 1: Send OTP to email ─────────────────────────── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with real backend call when endpoint is ready:
      // const data = await apiFetch("/user/forgot-password", "POST", {
      //   body: { email },
      // });
      // if (!data.success) { setError(data.message); return; }
      await new Promise((resolve) => setTimeout(resolve, 1400));

      setStep(STEP.OTP);
      startCooldown();
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP input handlers ────────────────────────────────── */
  const handleOtpChange = (index, value) => {
    // Only accept digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the next empty slot or last
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIdx = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    otpRefs.current[focusIdx]?.focus();
  };

  /* ── Step 2: Verify OTP ────────────────────────────────── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with real backend call when endpoint is ready:
      // const data = await apiFetch("/user/verify-reset-otp", "POST", {
      //   body: { email, otp: otpString },
      // });
      // if (!data.success) { setError(data.message); return; }
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStep(STEP.NEW_PASSWORD);
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Resend OTP ────────────────────────────────────────── */
  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with real backend call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setOtp(Array(OTP_LENGTH).fill(""));
      startCooldown();
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Step 3: Reset Password ────────────────────────────── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with real backend call when endpoint is ready:
      // const data = await apiFetch("/user/reset-password", "POST", {
      //   body: { email, otp: otp.join(""), newPassword },
      // });
      // if (!data.success) { setError(data.message); return; }
      await new Promise((resolve) => setTimeout(resolve, 1400));

      setStep(STEP.SUCCESS);
    } catch (err) {
      setError("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Progress indicator ────────────────────────────────── */
  const stepIndex =
    step === STEP.EMAIL ? 0 : step === STEP.OTP ? 1 : step === STEP.NEW_PASSWORD ? 2 : 3;

  return (
    <AuthLayout>
      <div className="forgot-container">
        <div className="forgot-card">
          {/* Progress bar */}
          {step !== STEP.SUCCESS && (
            <div className="forgot-progress">
              {["Email", "Verify", "Reset"].map((label, i) => (
                <div
                  key={label}
                  className={`forgot-progress-step ${i <= stepIndex ? "active" : ""} ${i < stepIndex ? "completed" : ""}`}
                >
                  <div className="forgot-progress-dot">
                    {i < stepIndex ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="forgot-progress-label">{label}</span>
                </div>
              ))}
              <div className="forgot-progress-bar">
                <div
                  className="forgot-progress-fill"
                  style={{ width: `${(stepIndex / 2) * 100}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ═══ STEP 1: EMAIL ═══ */}
            {step === STEP.EMAIL && (
              <motion.div
                key="step-email"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="forgot-header">
                  <div className="forgot-icon">
                    <KeyRound size={32} />
                  </div>
                  <h1 className="forgot-title">Reset Your Password</h1>
                  <p className="forgot-subtitle">
                    Enter the email linked to your account and we'll send you a
                    verification code
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="forgot-form">
                  <div className="forgot-email-field">
                    <label className="forgot-email-label" htmlFor="forgot-email">
                      Email Address
                    </label>
                    <div className={`forgot-email-box ${email ? "has-value" : ""}`}>
                      <div className="forgot-email-icon-wrap">
                        <Mail size={18} />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        className="forgot-email-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                      />
                      {email && (
                        <button
                          type="button"
                          className="forgot-email-clear"
                          onClick={() => setEmail("")}
                          tabIndex={-1}
                          aria-label="Clear email"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <button type="submit" className="forgot-button" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner">Sending…</span>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="forgot-footer">
                  <Link to="/login" className="forgot-back-link">
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: OTP VERIFICATION ═══ */}
            {step === STEP.OTP && (
              <motion.div
                key="step-otp"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="forgot-header">
                  <div className="forgot-icon">
                    <ShieldCheck size={32} />
                  </div>
                  <h1 className="forgot-title">Enter Verification Code</h1>
                  <p className="forgot-subtitle">
                    We've sent a {OTP_LENGTH}-digit code to
                  </p>
                  <p className="forgot-email-highlight">{email}</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="forgot-form">
                  {/* OTP Inputs */}
                  <div className="otp-input-group" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`otp-input ${digit ? "filled" : ""}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        disabled={isLoading}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.div
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <button type="submit" className="forgot-button" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner">Verifying…</span>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="forgot-resend-area">
                  <p className="forgot-resend-text">Didn't receive the code?</p>
                  <button
                    className="forgot-resend-btn"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || isLoading}
                  >
                    <RefreshCw size={14} className={isLoading ? "spin-icon" : ""} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>

                <div className="forgot-footer">
                  <button
                    className="forgot-back-link"
                    onClick={() => {
                      setStep(STEP.EMAIL);
                      setOtp(Array(OTP_LENGTH).fill(""));
                      setError("");
                    }}
                    type="button"
                  >
                    <ArrowLeft size={14} />
                    Change Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: NEW PASSWORD ═══ */}
            {step === STEP.NEW_PASSWORD && (
              <motion.div
                key="step-password"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="forgot-header">
                  <div className="forgot-icon">
                    <Lock size={32} />
                  </div>
                  <h1 className="forgot-title">Create New Password</h1>
                  <p className="forgot-subtitle">
                    Choose a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="forgot-form">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="form-input"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Password strength hints */}
                  <div className="password-rules">
                    <div className={`password-rule ${newPassword.length >= 6 ? "met" : ""}`}>
                      <CheckCircle2 size={12} />
                      <span>At least 6 characters</span>
                    </div>
                    <div className={`password-rule ${newPassword && newPassword === confirmPassword ? "met" : ""}`}>
                      <CheckCircle2 size={12} />
                      <span>Passwords match</span>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <button type="submit" className="forgot-button" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner">Resetting…</span>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="forgot-footer">
                  <Link to="/login" className="forgot-back-link">
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4: SUCCESS ═══ */}
            {step === STEP.SUCCESS && (
              <motion.div
                key="step-success"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="forgot-header">
                  <div className="forgot-icon forgot-icon--success">
                    <CheckCircle2 size={32} />
                  </div>
                  <h1 className="forgot-title">Password Reset!</h1>
                  <p className="forgot-subtitle">
                    Your password has been changed successfully. You can now sign
                    in with your new password.
                  </p>
                </div>

                <Link to="/login" className="forgot-button forgot-button--link">
                  <span>Sign In Now</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthLayout>
  );
}
