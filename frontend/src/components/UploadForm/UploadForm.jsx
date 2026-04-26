import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Ghost,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useDepartments, useSemesters } from "../../hooks/useDepartments";
import { getSubjectsForSemester } from "../../data/departments";
import { notifyPaperUpload } from "../../data/adminNotifications";
import "./UploadForm.css";

export default function UploadForm() {
  const { departments, loading: deptLoading } = useDepartments();
  const [semesters , setSemesters] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const fileRef = useRef();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const selectedDept = departments.find((d) => d.fullName === department);
  const subjects =
    selectedDept && semester
      ? getSubjectsForSemester(selectedDept, parseInt(semester))
      : [];

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxSize: 10485760, // 10MB
      multiple: false,
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowLoginWarning(true);
      return;
    }

    if (!department || !subject || !semester || !year || !file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("file", file);
    formData.append("isAnonymous", isAnonymous);

    const token = localStorage.getItem("access_token");
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        notifyPaperUpload({
          departmentLabel: selectedDept?.name || department,
          subjectLabel: subject,
          fileName: file?.name || "",
        });
        toast.success("Upload Successful", {
          description: "Your paper has been queued for admin review."
        });
        setSubmitted(true);
      } else {
        let errorMessage = "Upload failed";
        try {
          const res = JSON.parse(xhr.responseText);
          errorMessage = res.message || errorMessage;
        } catch (e) {}
        setUploadError(errorMessage);
        toast.error("Upload Failed", { description: errorMessage });
      }
      setUploading(false);
    };

    xhr.onerror = () => {
      setUploadError("Network error occurred during upload.");
      toast.error("Upload Failed", { description: "Network error occurred." });
      setUploading(false);
    };

    xhr.open("POST", `${BASE_URL}/files/upload`, true);
    if (token) {
      xhr.setRequestHeader("authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  };

  const resetForm = () => {
    setDepartment("");
    setSubject("");
    setSemester("");
    setYear("");
    setFile(null);
    setIsAnonymous(false);
    setSubmitted(false);
    setUploadError(null);
    setUploadProgress(0);
  };

  if (submitted) {
    return (
      <div className="upload-form-wrapper">
        <div className="upload-success glass-card" style={{ padding: "2rem" }}>
          <div className="upload-success-icon">
            <CheckCircle2 />
          </div>
          <h2 className="upload-success-title">Upload Submitted!</h2>
          <p className="upload-success-text">
            Your question paper has been submitted for review. An admin will
            verify and approve it before it appears on the main page.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="btn-cyber-solid" onClick={resetForm}>
              Upload Another
            </button>
            <Link to="/" className="btn-cyber">
              <ArrowRight size={14} />
              Browse Papers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Login Warning Modal
  if (showLoginWarning) {
    return (
      <div className="upload-form-wrapper">
        <motion.div
          className="login-warning-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="login-warning-modal glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              className="warning-close-btn"
              onClick={() => setShowLoginWarning(false)}
              aria-label="Close warning"
            >
              <X size={20} />
            </button>

            <div className="warning-icon">
              <AlertTriangle size={48} />
            </div>

            <h2 className="warning-title">Login Required</h2>
            <p className="warning-text">
              You need to log in or create an account before you can upload
              question papers. This helps us maintain quality and track
              contributions.
            </p>

            <div className="warning-actions">
              <button
                className="btn-cyber-solid"
                onClick={() =>
                  navigate("/login", {
                    state: { from: { pathname: "/upload" } },
                  })
                }
              >
                <ArrowRight size={16} />
                Go to Login
              </button>
              <button
                className="btn-cyber"
                onClick={() => setShowLoginWarning(false)}
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="upload-form-wrapper">
      <div className="upload-title-section">
        <div className="upload-badge">
          <Upload size={14} />
          Contribute
        </div>
        <h1 className="upload-title">Upload Question Paper</h1>
        <p className="upload-subtitle">
          Share question papers with fellow students. All uploads are reviewed
          by an admin before publishing.
        </p>
      </div>

      <form
        className="upload-form glass-card"
        style={{ padding: "2rem" }}
        onSubmit={handleSubmit}
      >
        {/* Department */}
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="select-cyber"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setSemester("");
              setSubject("");
            }}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.fullName} onClick={() => {setSemesters(Object.keys(dept.semesters))}}>
                {dept.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div className="form-group">
          <label className="form-label">Semester</label>
          <select
            className="select-cyber"
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setSubject("");
            }}
            required
            disabled={!department}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subject & Year */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              className="select-cyber"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={!semester}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="input-cyber"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year (e.g., 2024)"
              min="1900"
              max="2100"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label className="form-label">Question Paper (PDF)</label>
          {file ? (
            <div className="file-preview">
              <div className="file-preview-icon">
                <FileText size={18} />
              </div>
              <span className="file-preview-name">{file.name}</span>
              <span className="file-preview-size">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                type="button"
                className="file-preview-remove"
                onClick={() => {
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <motion.div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "dragover" : ""} ${isDragReject ? "reject" : ""}`}
              animate={{
                borderColor: isDragActive
                  ? "#afb3f7"
                  : isDragReject
                    ? "#ff8080"
                    : "rgba(122, 147, 172, 0.2)",
                backgroundColor: isDragActive
                  ? "rgba(175, 179, 247, 0.08)"
                  : isDragReject
                    ? "rgba(255, 128, 128, 0.08)"
                    : "transparent",
                scale: isDragActive ? 1.02 : 1,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps({ accept: ".pdf" })} />
              <motion.div
                className="dropzone-icon"
                animate={{ y: isDragActive ? -5 : 0 }}
              >
                <Upload />
              </motion.div>
              <p className="dropzone-text">
                {isDragActive ? (
                  isDragReject ? (
                    "Invalid file type!"
                  ) : (
                    "Drop paper here..."
                  )
                ) : (
                  <>
                    Drag & drop or <strong>browse</strong>
                  </>
                )}
              </p>
              <p className="dropzone-hint">PDF — Max 10MB</p>
            </motion.div>
          )}
        </div>

        {/* Anonymous Toggle */}
        <div 
          className={`anonymous-toggle-container ${isAnonymous ? 'active' : ''}`}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <div className="anonymous-toggle-icon">
            <Ghost size={20} />
          </div>
          <div className="anonymous-toggle-text">
            <div className="anonymous-toggle-title">Upload Anonymously</div>
            <div className="anonymous-toggle-desc">Hide my name when others view this paper</div>
          </div>
          <label className="anonymous-toggle" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ display: 'none' }}
            />
            <div className={`toggle-track ${isAnonymous ? 'active' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="upload-submit-row">
          <div className="upload-notice">
            <AlertTriangle size={14} />
            Paper will be reviewed before publishing.
          </div>
          <button
            type="submit"
            className="btn-cyber-solid"
            disabled={
              !department ||
              !subject ||
              !semester ||
              !year ||
              !file ||
              uploading
            }
            style={{
              opacity:
                !department ||
                !subject ||
                !semester ||
                !year ||
                !file ||
                uploading
                  ? 0.5
                  : 1,
            }}
          >
            <Upload size={14} />
            {uploading ? `Uploading ${uploadProgress}%` : "Submit Paper"}
          </button>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div style={{ marginTop: "1rem", width: "100%", background: "rgba(175, 179, 247, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div 
              style={{
                height: "6px",
                background: "var(--color-vault-lavender)",
                width: `${uploadProgress}%`,
                transition: "width 0.2s ease",
              }}
            />
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <motion.div
            className="upload-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(255, 128, 128, 0.1)",
              border: "1px solid rgba(255, 128, 128, 0.3)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              color: "#ff8080",
            }}
          >
            <AlertCircle
              size={18}
              style={{ flexShrink: 0, marginTop: "0.125rem" }}
            />
            <span>{uploadError}</span>
          </motion.div>
        )}
      </form>
    </div>
  );
}
