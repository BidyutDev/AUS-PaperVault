/**
 * In-app admin notifications (localStorage). Audience rules:
 * - paper_upload → all staff (reviewer, moderator, super admin)
 * - feedback → moderators + super admin only
 * - super_admin_only → super admin only
 */

const STORAGE = "vault_admin_notifications";
const READ_STORAGE = "vault_admin_notifications_read";
const MAX_ITEMS = 120;

export const AUDIENCE = {
  ALL_STAFF: "all_staff",
  MODERATORS_AND_SUPER: "moderators_and_super",
  SUPER_ADMIN_ONLY: "super_admin_only",
};

export const ADMIN_NOTIF_EVENT = "adminNotificationsUpdated";

export function normalizeAdminRole(role) {
  if (!role) return null;
  return String(role).toLowerCase().replace(/\s+/g, "_");
}

function audienceMatches(audience, normalizedRole) {
  if (!normalizedRole) return false;
  if (audience === AUDIENCE.ALL_STAFF) {
    return ["super_admin", "moderator", "reviewer"].includes(normalizedRole);
  }
  if (audience === AUDIENCE.MODERATORS_AND_SUPER) {
    return ["super_admin", "moderator"].includes(normalizedRole);
  }
  if (audience === AUDIENCE.SUPER_ADMIN_ONLY) {
    return normalizedRole === "super_admin";
  }
  return false;
}

export function getAllAdminNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getReadMap() {
  try {
    return JSON.parse(localStorage.getItem(READ_STORAGE) || "{}") || {};
  } catch {
    return {};
  }
}

function readSetForUser(username) {
  const map = getReadMap();
  const arr = map[username] || [];
  return new Set(arr);
}

export function isAdminNotificationRead(username, notificationId) {
  return readSetForUser(username).has(notificationId);
}

export function pushAdminNotification({ audience, type, title, body, linkTab = null, meta = {} }) {
  const list = getAllAdminNotifications();
  const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const item = {
    id,
    createdAt: new Date().toISOString(),
    audience,
    type,
    title,
    body,
    linkTab,
    meta,
  };
  list.unshift(item);
  localStorage.setItem(STORAGE, JSON.stringify(list.slice(0, MAX_ITEMS)));
  window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
}

export function getNotificationsForUser(username, role) {
  const norm = normalizeAdminRole(role);
  return getAllAdminNotifications().filter((n) => audienceMatches(n.audience, norm));
}

export function getUnreadAdminNotificationCount(username, role) {
  const read = readSetForUser(username);
  return getNotificationsForUser(username, role).filter((n) => !read.has(n.id)).length;
}

export function markAdminNotificationRead(username, id) {
  const map = getReadMap();
  if (!map[username]) map[username] = [];
  if (!map[username].includes(id)) map[username].push(id);
  localStorage.setItem(READ_STORAGE, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
}

export function markAllAdminNotificationsRead(username, role) {
  const ids = getNotificationsForUser(username, role).map((n) => n.id);
  const map = getReadMap();
  if (!map[username]) map[username] = [];
  map[username] = [...new Set([...map[username], ...ids])];
  localStorage.setItem(READ_STORAGE, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
}

/** Question paper submitted (API or mock queue) — all staff */
export function notifyPaperUpload({ departmentLabel = "", subjectLabel = "", fileName = "" } = {}) {
  const parts = [departmentLabel, subjectLabel].filter(Boolean);
  const summary = parts.length ? parts.join(" · ") : "Review queue";
  const extra = fileName ? ` — ${fileName}` : "";
  pushAdminNotification({
    audience: AUDIENCE.ALL_STAFF,
    type: "paper_upload",
    title: "New question paper upload",
    body: `A paper was submitted for review (${summary})${extra}.`,
    linkTab: "review",
    meta: { departmentLabel, subjectLabel, fileName },
  });
}

/** User feedback — moderators + super admin */
export function notifyFeedbackSubmitted({ name = "Anonymous", preview = "" } = {}) {
  const clip = preview.length > 120 ? `${preview.slice(0, 120)}…` : preview;
  pushAdminNotification({
    audience: AUDIENCE.MODERATORS_AND_SUPER,
    type: "feedback",
    title: "New user feedback",
    body: clip ? `${name}: ${clip}` : `${name} submitted feedback.`,
    linkTab: "feedback",
    meta: { name, preview },
  });
}

/** Catalog, departments, staff, etc. — super admin only */
export function notifySuperAdminEvent({ title, body, linkTab = null, type = "system", meta = {} }) {
  pushAdminNotification({
    audience: AUDIENCE.SUPER_ADMIN_ONLY,
    type,
    title,
    body,
    linkTab,
    meta,
  });
}
