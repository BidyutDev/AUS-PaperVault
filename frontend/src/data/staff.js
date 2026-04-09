// Mock schema for handling frontend-assigned Staff rules.
// Structure: { id, username, password, role, assignedAt }

import { notifySuperAdminEvent } from "./adminNotifications";

const LOCAL_STORAGE_KEY = "vault_staff";

// Default admin users that parallel the backend for visual representation
const defaultAdmins = [
  { id: "1", username: "admin", role: "Super Admin", isRoot: true },
  { id: "2", username: "moderator", role: "Moderator", isRoot: true },
  { id: "3", username: "reviewer", role: "Reviewer", isRoot: true }
];

export const getStaff = () => {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultAdmins));
      return defaultAdmins;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Failed to parse staff data", error);
    return defaultAdmins;
  }
};

export const addStaff = (username, password, role) => {
  const staff = getStaff();
  
  // Update if exists
  const existingIndex = staff.findIndex(s => s.username === username);
  if (existingIndex >= 0) {
    if (staff[existingIndex].isRoot) return { success: false, error: "Cannot modify root system administrators." };
    staff[existingIndex] = { ...staff[existingIndex], role, password: password || staff[existingIndex].password };
  } else {
    // Determine ID
    const newId = Date.now().toString();
    staff.push({
      id: newId,
      username,
      password: password || "123456", // Mock default password for newly promoted local staff 
      role,
      assignedAt: new Date().toISOString()
    });
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staff));
  window.dispatchEvent(new CustomEvent("staffUpdated"));
  if (existingIndex >= 0) {
    notifySuperAdminEvent({
      title: "Staff role updated",
      body: `User "${username}" is now ${role}.`,
      linkTab: "staff",
      type: "staff",
    });
  } else {
    notifySuperAdminEvent({
      title: "Staff promoted",
      body: `${username} was granted ${role} access.`,
      linkTab: "staff",
      type: "staff",
    });
  }
  return { success: true };
};

export const removeStaff = (id) => {
  const staff = getStaff();
  
  const existingItem = staff.find(s => s.id === id);
  if (existingItem && existingItem.isRoot) {
     return { success: false, error: "Cannot remove root system administrators." };
  }

  const newStaff = staff.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStaff));
  window.dispatchEvent(new CustomEvent("staffUpdated"));
  notifySuperAdminEvent({
    title: "Staff access revoked",
    body: `Removed admin access for ${existingItem?.username || id}.`,
    linkTab: "staff",
    type: "staff",
  });
  return { success: true };
};

export const checkLocalStaffAuth = (username, password) => {
  const staff = getStaff();
  const valid = staff.find(s => s.username === username && s.password === password);
  
  if (valid) return { success: true, username: valid.username, role: valid.role };
  return { success: false, error: "Invalid credentials" };
};
