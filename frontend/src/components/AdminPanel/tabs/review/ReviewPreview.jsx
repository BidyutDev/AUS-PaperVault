import feedbackPdf from "../FEEDBACK.pdf";

/**
 * PDF preview area.
 * Always embeds the bundled FEEDBACK.pdf as a preview example.
 * When the backend adds a file-serving endpoint (e.g. GET /files/view/:id),
 * replace `feedbackPdf` with the constructed URL.
 */
export default function ReviewPreview({ selected }) {
  //   const previewUrl = `${API_BASE}/files/view/${selected?._id}`;
  const previewUrl = `http://localhost:3000/uploads${selected.path.split("uploads")[1]}`;

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
