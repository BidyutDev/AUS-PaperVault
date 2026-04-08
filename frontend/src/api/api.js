const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, method = "GET", options = {}) => {
    const fetchOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    };

    // Only attach body for non-GET/HEAD requests
    if (method !== "GET" && method !== "HEAD" && options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("API fetch error:", err);
        return { success: false, message: err.message };
    }
};