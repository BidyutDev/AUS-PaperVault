import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  User,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import "./SignUpPage.css";
import { apiFetch } from "../api/api";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [isSendingCode, setIsSendingCode] = useState(false);
  
  const otpRefs = useRef([]);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (index, value) => {
    // Only accept digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...verificationCode];
    newOtp[index] = value;
    setVerificationCode(newOtp);
    if (errors.verify) setErrors((prev) => ({ ...prev, verify: null }));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newOtp = [...verificationCode];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setVerificationCode(newOtp);
    if (errors.verify) setErrors((prev) => ({ ...prev, verify: null }));

    // Focus the next empty slot or last
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    otpRefs.current[focusIdx]?.focus();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, hyphens, and underscores";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSendingCode(true);

    try {
      const otpRes = await apiFetch("/email/send-verification", "POST", {
        body: {
          username: formData.username.trim(),
          email: formData.email.trim(),
        },
      });

      if (otpRes.success) {
        setShowVerificationModal(true);
        setIsSendingCode(false);
        return;
      }
      throw new Error(otpRes.message || "Error in sending otp");
    } catch (err) {
      console.log(err);
      setIsSendingCode(false);
      setErrors({ submit: err.message || "Sign up failed. Please try again." });
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    const otpString = verificationCode.join("");
    if (otpString.length < 6) {
      setErrors({ verify: "Please enter a valid 6-digit verification code." });
      return;
    }

    setIsLoading(true);

    try {
      const verifyOtp = await apiFetch("/email/verify-otp", "POST", {
        body: {
          username: formData.username.trim(),
          email: formData.email.trim(),
          otp: otpString,
        },
      });
      if (verifyOtp.success) {
        const data = await signup(formData);
        if (!data.success) {
          throw new Error(data.message || "Error in signing up");
        }
        navigate("/");
      } else {
        setErrors({ verify: verifyOtp.message || "Verification failed." });
        return;
      }
    } catch (err) {
      setErrors({ submit: err.message || "Sign up failed. Please try again." });
      setShowVerificationModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setErrors((prev) => ({ ...prev, verify: null }));
    try {
      import("sonner").then(({ toast }) => {
        toast.success("Verification code resent!");
      });
      const otpResend = await apiFetch("/email/resend-otp", "POST", {
        body: {
          username: formData.username.trim(),
          email: formData.email.trim(),
        },
      });
      if (!otpResend.success) {
        import("sonner").then(({ toast }) => {
          toast.error("Error in sending verification code");
        });
      }
    } catch (err) {
      import("sonner").then(({ toast }) => {
        toast.error("Error in sending verification code");
      });
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength] || "";
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#64748b", "#ef4444", "#f97316", "#eab308", "#22c55e"];
    return colors[passwordStrength] || colors[0];
  };

  return (
    <AuthLayout>
      <div className="signup-container">
        <div className="signup-card">
          {/* Card Header */}
          <div className="signup-header">
            <div className="signup-icon">
              <User size={32} />
            </div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">
              Join PaperVault and start sharing knowledge
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    className={`form-input ${errors.firstName ? "input-error" : ""}`}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <span className="error-text">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    className={`form-input ${errors.lastName ? "input-error" : ""}`}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <span className="error-text">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="form-group">
              <label className="form-label">Username *</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div className="input-wrapper">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  name="phoneNumber"
                  className={`form-input ${errors.phoneNumber ? "input-error" : ""}`}
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <span className="error-text">{errors.phoneNumber}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${errors.password ? "input-error" : ""}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}

              {/* Password Strength */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <span
                    className="strength-label"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="checkbox-input"
                />
                <label htmlFor="agreeTerms" className="checkbox-label">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="error-text">{errors.agreeTerms}</span>
              )}
            </div>

            {/* General Error */}
            {errors.submit && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertTriangle size={16} />
                {errors.submit}
              </motion.div>
            )}

            {/* Submit Button & Loader */}
            {isSendingCode ? (
              <div
                className="verification-loading-view"
                style={{ padding: "1rem 0" }}
              >
                <div className="theme-loader"></div>
                <p
                  className="verification-subtitle"
                  style={{
                    margin: "1rem 0 0 0",
                    fontSize: "0.9rem",
                    color: "var(--color-vault-lavender)",
                  }}
                >
                  Please Wait! Creating Your Account...
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="signup-button"
                disabled={isLoading}
              >
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              </button>
            )}

            {/* Login Link */}
            <p className="login-link">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Verification Modal Overlay */}
      {showVerificationModal && (
        <div className="verification-overlay">
          <motion.div
            className="verification-modal glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="verification-icon-wrapper">
              <Mail size={32} />
            </div>
            <h2 className="verification-title">Verify your Email</h2>
            <p className="verification-subtitle">
              We've sent a 6-digit verification code to{" "}
              <strong>{formData.email || "your email"}</strong>.
            </p>

            <form onSubmit={handleVerifyEmail} className="verification-form forgot-form">
              <div className="otp-input-group" onPaste={handleOtpPaste}>
                {verificationCode.map((digit, i) => (
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
              {errors.verify && (
                  <span
                    className="error-text text-center"
                    style={{ marginTop: "0.5rem", display: "block" }}
                  >
                    {errors.verify}
                  </span>
                )}

              <div className="verification-actions">
                <button
                  type="button"
                  className="btn-verify-cancel"
                  onClick={() => setShowVerificationModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-verify-submit"
                  disabled={
                    isLoading || 
                    verificationCode.join("").length < 6 || 
                    (errors.verify && (
                      errors.verify.toLowerCase().includes("too many") ||
                      errors.verify.toLowerCase().includes("expired") ||
                      errors.verify.toLowerCase().includes("no otp")
                    ))
                  }
                >
                  {isLoading ? (
                    <span className="loading-spinner">Verifying…</span>
                  ) : (
                    <>
                      <span>Verify & Sign Up</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div
                className="resend-wrapper"
                style={{
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                  color: "var(--color-vault-gray)",
                }}
              >
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="terms-link"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Resend Code
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AuthLayout>
  );
}
