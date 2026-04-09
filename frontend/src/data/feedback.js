// src/data/feedback.js

import { notifyFeedbackSubmitted } from "./adminNotifications";

const STORAGE_KEY = "vault_feedback";

/**
 * Initialize feedback with some mock data if empty.
 */
function initFeedback() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const mockFeedback = [
      {
        id: "f1",
        name: "Alice Smith",
        email: "alice@example.com",
        message: "The search function is amazing! Helps me find papers so quickly.",
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "f2",
        name: "Bob Jones",
        email: "",
        message: "Can we get more mock papers for the Civil Engineering department?",
        submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFeedback));
  }
}

export function getFeedback() {
  initFeedback();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function submitFeedback(data) {
  initFeedback();
  const feedbackList = getFeedback();
  const newFeedback = {
    id: "f_" + Date.now(),
    name: data.name || "Anonymous",
    email: data.email || "",
    message: data.message,
    submittedAt: new Date().toISOString(),
  };
  
  feedbackList.unshift(newFeedback); // add to top
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));

  notifyFeedbackSubmitted({
    name: newFeedback.name,
    preview: newFeedback.message || "",
  });

  // Notify other components
  window.dispatchEvent(new Event("feedbackUpdated"));
  return newFeedback;
}

export function deleteFeedback(id) {
  const feedbackList = getFeedback();
  const filtered = feedbackList.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("feedbackUpdated"));
}
