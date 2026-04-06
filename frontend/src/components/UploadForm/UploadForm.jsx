import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import departments, { YEARS, SEMESTERS, getSubjectsForSemester } from '../../data/departments';
import { addPendingUpload } from '../../data/mockPapers';
import './UploadForm.css';

export default function UploadForm() {
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const selectedDept = departments.find((d) => d.id === department);
  const subjects = (selectedDept && semester) ? getSubjectsForSemester(selectedDept, parseInt(semester)) : [];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!department || !subject || !semester || !year || !file) return;

    addPendingUpload({
      department,
      subject,
      semester: parseInt(semester),
      year: parseInt(year),
      fileName: file.name,
      fileSize: file.size,
      uploaderName: 'Anonymous',
    });

    setSubmitted(true);
  };

  const resetForm = () => {
    setDepartment('');
    setSubject('');
    setSemester('');
    setYear('');
    setFile(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="upload-form-wrapper">
        <div className="upload-success glass-card" style={{ padding: '2rem' }}>
          <div className="upload-success-icon">
            <CheckCircle2 />
          </div>
          <h2 className="upload-success-title">Upload Submitted!</h2>
          <p className="upload-success-text">
            Your question paper has been submitted for review. An admin will verify
            and approve it before it appears on the main page.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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

  return (
    <div className="upload-form-wrapper">
      <div className="upload-title-section">
        <div className="upload-badge">
          <Upload size={14} />
          Contribute
        </div>
        <h1 className="upload-title">Upload Question Paper</h1>
        <p className="upload-subtitle">
          Share question papers with fellow students. All uploads are reviewed by
          an admin before publishing.
        </p>
      </div>

      <form className="upload-form glass-card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
        {/* Department */}
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="select-cyber"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setSemester('');
              setSubject('');
            }}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
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
              setSubject('');
            }}
            required
            disabled={!department}
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((sem) => (
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
            <select
              className="select-cyber"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="">Select Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label className="form-label">Question Paper (Image / PDF)</label>
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
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              className={`dropzone ${dragOver ? 'dragover' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="dropzone-icon">
                <Upload />
              </div>
              <p className="dropzone-text">
                Drag & drop or <strong>browse</strong>
              </p>
              <p className="dropzone-hint">PDF, JPG, PNG — Max 10MB</p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />
            </div>
          )}
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
            disabled={!department || !subject || !semester || !year || !file}
            style={{ opacity: (!department || !subject || !semester || !year || !file) ? 0.5 : 1 }}
          >
            <Upload size={14} />
            Submit Paper
          </button>
        </div>
      </form>
    </div>
  );
}
