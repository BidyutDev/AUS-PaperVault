/**
 * Shared utility functions for the review tab components.
 */

/** Truncate a MongoDB _id for display. */
export function queueIdLabel(id) {
  return String(id).slice(-6).toUpperCase();
}

/** Human-readable relative time from a timestamp. */
export function getTimeAgo(timestamp, now = Date.now()) {
  if (!timestamp) return "just now";
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Resolve a department slug to its full name. */
export function getDeptName(deptId, allDepartments = []) {
  const dept = allDepartments.find(
    (d) => d.id === deptId || d.fullName === deptId || d.shortName === deptId || d._id === deptId
  );
  return dept ? dept.name : deptId || "Unknown";
}

/** Resolve a department slug to its short code. */
export function getDeptShort(deptId, allDepartments = []) {
  const dept = allDepartments.find(
    (d) => d.id === deptId || d.fullName === deptId || d.shortName === deptId || d._id === deptId
  );
  return dept ? dept.shortName : String(deptId || "").toUpperCase();
}
