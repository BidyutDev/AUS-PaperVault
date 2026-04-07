const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint , method = "GET" , options = {}) => {

    const res = await fetch(`${BASE_URL}${endpoint}` , {
        method : method,
        headers : {
            "Content-Type" : "application/json",
            ...(options.headers || {})
        },
        body: JSON.stringify(options?.body || {}), 
    });
    const data = await res.json();

    return data

};