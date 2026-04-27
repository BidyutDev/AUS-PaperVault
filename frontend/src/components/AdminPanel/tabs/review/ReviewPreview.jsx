import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");

export default function ReviewPreview({ selected }) {
  const [blobUrl, setBlobUrl] = useState(null);

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

  // Fetch PDF as blob to bypass ngrok interstitial page in iframes
  useEffect(() => {
    if (!selected?.path) {
      setBlobUrl(null);
      return;
    }

    let cancelled = false;
    const url = getPreviewUrl();

    fetch(url, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        if (!cancelled) {
          const objUrl = URL.createObjectURL(blob);
          setBlobUrl(objUrl);
        }
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(url); // fallback to direct URL
      });

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [selected?._id]);

  return (
    <div className="admin-preview-area">
      <div className="admin-preview-embed">
        {blobUrl ? (
          <iframe
            src={blobUrl}
            title={`Preview: ${selected?.fileName}`}
            className="admin-preview-iframe"
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-vault-steel)" }}>
            Loading preview...
          </div>
        )}
        <div className="admin-preview-overlay-label">
          [ DOCUMENT_PREVIEW ::{" "}
          {selected?.originalName || selected?.fileName || "FEEDBACK.pdf"} ]
        </div>
      </div>
    </div>
  );
}
