import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  ADMIN_NOTIF_EVENT,
  getNotificationsForUser,
  getUnreadAdminNotificationCount,
  isAdminNotificationRead,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "../../data/adminNotifications";

const LINK_TAB_HINT = {
  review: "Open review queue",
  departments: "Open departments",
  analytics: "Open analytics",
  catalog: "Open catalog",
  feedback: "Open feedback",
  staff: "Open staff",
};

function formatNotifTime(iso) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminNotificationsBell({ currentAdmin, hasAccessToTab, setAdminTab }) {
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);
  const wrapRef = useRef(null);

  const username = currentAdmin?.username ?? "";
  const role = currentAdmin?.role ?? "";

  const refresh = useCallback(() => bump((v) => v + 1), []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!open) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    window.addEventListener(ADMIN_NOTIF_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ADMIN_NOTIF_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const list = getNotificationsForUser(username, role);
  const unread = getUnreadAdminNotificationCount(username, role);

  const handleOpenItem = (n) => {
    markAdminNotificationRead(username, n.id);
    refresh();
    if (n.linkTab && hasAccessToTab(role, n.linkTab)) {
      setAdminTab(n.linkTab);
    }
    setOpen(false);
  };

  return (
    <div className="admin-notif-wrap" ref={wrapRef}>
      <button
        type="button"
        className="admin-notif-trigger"
        title="Notifications"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={16} strokeWidth={2} />
        {unread > 0 && <span className="admin-notif-badge">{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <div className="admin-notif-dropdown" role="menu">
          <div className="admin-notif-dropdown-head">
            <span className="admin-notif-dropdown-title">Alerts</span>
            {unread > 0 && (
              <button
                type="button"
                className="admin-notif-mark-all"
                onClick={() => {
                  markAllAdminNotificationsRead(username, role);
                  refresh();
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="admin-notif-list">
            {list.length === 0 ? (
              <div className="admin-notif-empty">No notifications yet.</div>
            ) : (
              list.map((n) => {
                const read = isAdminNotificationRead(username, n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    role="menuitem"
                    className={`admin-notif-item ${read ? "" : "admin-notif-item--unread"}`}
                    onClick={() => handleOpenItem(n)}
                  >
                    <div className="admin-notif-item-top">
                      <span className="admin-notif-item-title">{n.title}</span>
                      <span className="admin-notif-item-time">{formatNotifTime(n.createdAt)}</span>
                    </div>
                    <p className="admin-notif-item-body">{n.body}</p>
                    {n.linkTab && hasAccessToTab(role, n.linkTab) && LINK_TAB_HINT[n.linkTab] && (
                      <span className="admin-notif-item-hint">{LINK_TAB_HINT[n.linkTab]}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
