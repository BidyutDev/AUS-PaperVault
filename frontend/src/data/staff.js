import { apiFetch } from "../api/api";
import { notifySuperAdminEvent } from "./adminNotifications";

export const getUsers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await apiFetch("/staff/user-list", "GET", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (res.success) {
      return res.users;
    }
    return [];
  } catch (err) {
    return [];
  }
};

export const getStaff = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await apiFetch("/staff/staff-list", "GET", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.success) {
      return res.staff;
    }
    return [];
  } catch (error) {
    console.error("Failed to parse staff data", error);
    return [];
  }
};

export const updateStaff = async (username, role) => {
  try {
    const staff = await getStaff();

    const existingStaff = staff.find((s) => s.username === username && s.role === role);

    if (!existingStaff || existingStaff.length == 0) {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/staff/update-stuff", "POST", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {
          username,
          role,
        },
      });

      window.dispatchEvent(new CustomEvent("staffUpdated"));
      if (!res.success) {
        notifySuperAdminEvent({
          title: "Error in granting staff role",
          body: `${username} is not granted ${role} access.`,
          linkTab: "staff",
          type: "staff",
        });
        return { success: false };
      }

      notifySuperAdminEvent({
        title: "Staff role updated",
        body: `${username} is granted ${role} access.`,
        linkTab: "staff",
        type: "staff",
      });

      return { success: true };
    } else {
      throw new Error();
    }
  } catch (err) {
    window.dispatchEvent(new CustomEvent("staffUpdated"));
    notifySuperAdminEvent({
      title: `Already has ${role} access`,
      body: `${username} is a ${role} only.`,
      linkTab: "staff",
      type: "staff",
    });
    return { success: false };
  }
};

export const removeStaff = async (st) => {
  try {
    const staff = await getStaff();
    const existingItem = staff.find((s) => s.id === st._id);
    if (existingItem && existingItem.role == "Super Admin") {
      return {
        success: false,
        error: "Cannot remove root system administrators.",
      };
    }
    const token = localStorage.getItem("access_token");
    const res = await apiFetch("/staff/update-stuff", "POST", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        username: st.username,
        role: "Member",
      },
    });
    console.log(res)
    if (res.success) {
      window.dispatchEvent(new CustomEvent("staffUpdated"));
      notifySuperAdminEvent({
        title: "Staff access revoked",
        body: `Removed admin access for ${st.username}.`,
        linkTab: "staff",
        type: "staff",
      });
      return { success: true };
    } else {
      throw new Error();
    }
  } catch (err) {
    window.dispatchEvent(new CustomEvent("staffUpdated"));
    notifySuperAdminEvent({
      title: `Error in revoking staff access`,
      body: `${st.username} is still a ${st.role}.`,
      linkTab: "staff",
      type: "staff",
    });
    return { success: false };
  }
};
