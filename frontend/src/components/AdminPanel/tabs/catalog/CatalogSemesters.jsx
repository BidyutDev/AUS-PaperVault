import { Plus, Trash2 } from "lucide-react";

export default function CatalogSemesters({
  semestersData,
  newSemester,
  setNewSemester,
  handleAddSemester,
  handleDeleteSemester,
  canDelete = true,
}) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", color: "var(--color-vault-steel)", marginBottom: "1rem" }}>
        Manage Semesters
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        {semestersData.map((sem) => (
          <div
            key={sem}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              backgroundColor: "rgba(175, 179, 247, 0.05)",
              border: "1px solid rgba(175, 179, 247, 0.1)",
              borderRadius: "6px",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              gap: "0.5rem",
            }}
          >
            <span>Semester {sem}</span>
            {canDelete && (
              <button
                onClick={() => handleDeleteSemester(sem)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="number"
          placeholder="Enter semester (1-16)"
          value={newSemester}
          onChange={(e) => setNewSemester(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddSemester(newSemester);
            }
          }}
          min="1"
          max="16"
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            backgroundColor: "rgba(22, 26, 34, 0.5)",
            border: "1px solid rgba(175, 179, 247, 0.2)",
            borderRadius: "6px",
            color: "#e6edf3",
            fontSize: "0.875rem",
          }}
        />
        <button
          onClick={() => handleAddSemester(newSemester)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(175, 179, 247, 0.2)",
            border: "1px solid rgba(175, 179, 247, 0.3)",
            color: "#e6edf3",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.875rem",
          }}
        >
          <Plus size={14} />
          Add Semester
        </button>
      </div>
    </div>
  );
}
