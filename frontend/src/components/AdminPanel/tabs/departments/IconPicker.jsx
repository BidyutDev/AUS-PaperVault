import { useState, useEffect, useMemo } from "react";
import { ICON_MAP, AVAILABLE_ICONS, DEPARTMENT_ICON_PRESETS } from "../../../../data/departments";

/**
 * Icon picker grid for selecting a department icon.
 *
 * Props:
 *   selectedIcon   – current iconName string (e.g. "Monitor")
 *   onSelect       – callback(iconName)
 *   departmentName – optional; used to auto-suggest an icon
 */
export default function IconPicker({ selectedIcon, onSelect, departmentName }) {
  const [search, setSearch] = useState("");

  // Auto-suggest when department name changes
  useEffect(() => {
    if (!departmentName || selectedIcon) return;
    const lower = departmentName.toLowerCase();
    for (const [keyword, iconName] of Object.entries(DEPARTMENT_ICON_PRESETS)) {
      if (lower.includes(keyword)) {
        onSelect(iconName);
        return;
      }
    }
  }, [departmentName]);

  // Filter icons by search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) return AVAILABLE_ICONS;
    const q = search.toLowerCase();
    return AVAILABLE_ICONS.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
      <label className="admin-form-label">Department Icon</label>

      {/* Selected preview */}
      {selectedIcon && ICON_MAP[selectedIcon] && (
        <div className="admin-icon-preview">
          {(() => {
            const Icon = ICON_MAP[selectedIcon];
            return <Icon size={20} />;
          })()}
          <span className="admin-icon-preview-name">{selectedIcon}</span>
        </div>
      )}

      {/* Search filter */}
      <input
        type="text"
        className="admin-form-input"
        placeholder="Search icons…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "0.5rem" }}
      />

      {/* Grid */}
      <div className="admin-icon-grid">
        {filteredIcons.map((name) => {
          const Icon = ICON_MAP[name];
          const isSelected = selectedIcon === name;
          return (
            <button
              key={name}
              type="button"
              className={`admin-icon-cell ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(name)}
              title={name}
            >
              <Icon size={18} />
              <span className="admin-icon-cell-label">{name}</span>
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <span className="admin-icon-grid-empty">No icons matching &quot;{search}&quot;</span>
        )}
      </div>
    </div>
  );
}
