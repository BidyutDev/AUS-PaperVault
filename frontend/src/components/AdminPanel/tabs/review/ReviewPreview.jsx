const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");

export default function ReviewPreview({ selected }) {
  const getPreviewUrl = () => {
    if (!selected?.path) return "";
    const normalizedPath = selected.path.replace(/\\/g, "/");
    const uploadsIndex = normalizedPath.indexOf("uploads");
    if (uploadsIndex !== -1) {
      const pathAfterUploads = normalizedPath.substring(uploadsIndex + 7);
      const formattedPath = pathAfterUploads.startsWith("/") ? pathAfterUploads : `/${pathAfterUploads}`;
      return `${BASE_URL}/uploads${formattedPath}`;
    }
    return `${BASE_URL}/${normalizedPath}`;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className="admin-preview-area">
      <div className="admin-preview-embed">
        <iframe
          src={previewUrl}
          title={`Preview: ${selected?.fileName}`}
          className="admin-preview-iframe"
        />
        <div className="admin-preview-overlay-label">
          [ DOCUMENT_PREVIEW ::{" "}
          {selected?.originalName || selected?.fileName || "FEEDBACK.pdf"} ]
        </div>
      </div>
    </div>
  );
}
