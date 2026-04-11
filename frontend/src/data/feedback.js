// src/data/feedback.js

import { apiFetch } from "../api/api";

export async function getFeedback() {
  try {
    const token = localStorage.getItem("access_token");
    const data = await apiFetch("/feedback/list", "GET", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data.feedbacks;
  } catch (e) {
    return [];
  }
}

export async function deleteFeedback(id) {
  try {
    const token = localStorage.getItem("access_token");
    const data = await apiFetch(`/feedback/delete/${id}`, "DELETE", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!data.success) {
      throw new Error("Error in deleting feedback");
    }
    window.dispatchEvent(new Event("feedbackUpdated"));
  } catch (err) {
    throw new Error("Error in deleting feedback");
  }
}
