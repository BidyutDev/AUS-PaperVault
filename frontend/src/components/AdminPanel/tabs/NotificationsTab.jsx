import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Send, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  X,
  FileText,
  Type
} from "lucide-react";

export default function NotificationsTab() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    link: "",
    imageUrl: "",
    type: "info"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStatus({ type: "", message: "" });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  });

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: "" }));
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_URL}/notifications/upload-image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: data
      });
      
      const resData = await response.json();
      if (resData.success) {
        return resData.imageUrl;
      } else {
        throw new Error(resData.message || "Image upload failed");
      }
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      let finalImageUrl = formData.imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_URL}/notifications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, imageUrl: finalImageUrl })
      });
      
      const resData = await response.json();

      if (resData.success) {
        setStatus({ type: "success", message: "System broadcast successful! All users notified." });
        setFormData({ title: "", message: "", link: "", imageUrl: "", type: "info" });
        setImageFile(null);
        setImagePreview(null);
      } else {
        throw new Error(resData.message || "Failed to publish notification");
      }
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.message || "An unexpected error occurred" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-notifications-tab">
      <div className="admin-tab-header">
        <div className="header-icon-wrap">
          <Send size={24} />
        </div>
        <div className="header-text-wrap">
          <h2 className="admin-tab-title">System_Broadcast</h2>
          <p className="admin-tab-subtitle">Direct line to all users. Triggers real-time alerts and email notifications.</p>
        </div>
      </div>

      <div className="admin-broadcast-container">
        <form className="admin-broadcast-form" onSubmit={handleSubmit}>
          <div className="form-main-section glass-card">
            <div className="admin-form-group">
              <label className="admin-form-label">
                <Type size={14} />
                Broadcast Title
              </label>
              <input
                type="text"
                className="admin-form-input highlight"
                placeholder="e.g., Major System Upgrade Scheduled"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                <FileText size={14} />
                Message Content
              </label>
              <textarea
                className="admin-form-input highlight"
                style={{ minHeight: "150px", resize: "vertical" }}
                placeholder="Detailed explanation of the update..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-row two-cols">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <AlertCircle size={14} />
                  Alert Level
                </label>
                <select
                  className="admin-form-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="info">Information (Standard)</option>
                  <option value="announcement">Announcement (New Feature)</option>
                  <option value="alert">Alert (Urgent Action)</option>
                  <option value="maintenance">Maintenance (Downtime)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  <LinkIcon size={14} />
                  Action Link
                </label>
                <input
                  type="url"
                  className="admin-form-input"
                  placeholder="https://example.com/details"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-side-section">
            <div className="image-upload-section glass-card">
              <label className="admin-form-label">
                <ImageIcon size={14} />
                Visual Asset (Drop Box)
              </label>
              
              {!imagePreview ? (
                <div 
                  {...getRootProps()} 
                  className={`dropzone-container ${isDragActive ? 'active' : ''}`}
                >
                  <input {...getInputProps()} />
                  <Upload size={32} className="upload-icon" />
                  <p>{isDragActive ? "Drop the image here" : "Drag & drop image, or click to browse"}</p>
                  <span className="upload-hint">JPG, PNG, WEBP (Max 5MB)</span>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="upload-preview" />
                  <button type="button" className="remove-image-btn" onClick={removeImage}>
                    <X size={16} />
                  </button>
                  <div className="image-info">
                    <span className="image-name">{imageFile?.name}</span>
                    <span className="image-size">{(imageFile?.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              )}
            </div>

            <div className="broadcast-action-card glass-card">
              <div className="broadcast-status-info">
                <div className="status-item">
                  <CheckCircle2 size={14} className="active" />
                  <span>Real-time WebSocket Sync</span>
                </div>
                <div className="status-item">
                  <CheckCircle2 size={14} className="active" />
                  <span>Global Email Broadcast</span>
                </div>
              </div>

              {status.message && (
                <div className={`admin-form-${status.type} floating-status`}>
                  {status.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                className="admin-form-submit premium" 
                disabled={loading || uploading}
              >
                {loading || uploading ? (
                  <div className="loader-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  <>
                    <Send size={16} />
                    Push Broadcast
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
