const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Safely parse JSON API response and catch HTML error pages (e.g. 500 Vercel error pages)
 */
const parseJSONResponse = async (response, defaultErrorMessage = "Request failed") => {
  const text = await response.text();
  let data = null;

  try {
    data = JSON.parse(text);
  } catch (parseError) {
    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(`Server error (HTTP ${response.status}). Please verify environment variables (MONGODB_URI) in Vercel.`);
      }
      throw new Error(`HTTP Error ${response.status}: Unable to process request.`);
    }
    throw new Error("Invalid response received from server.");
  }

  if (!response.ok) {
    if (response.status === 401 && (data.message?.includes("token") || data.message?.includes("authorized") || data.message?.includes("Not authorized"))) {
      localStorage.removeItem("ams_hackathon_2026_admin_token");
      localStorage.removeItem("ams_hackathon_2026_admin_user");
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    throw new Error(data.message || defaultErrorMessage);
  }

  return data;
};

export const adminLoginAPI = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await parseJSONResponse(response, "Admin login failed");
  } catch (error) {
    console.error("API error during admin login:", error);
    throw error;
  }
};

export const createPaymentOrderAPI = async (teamSize) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamSize }),
    });
    return await parseJSONResponse(response, "Failed to create payment order");
  } catch (error) {
    console.error("API error creating Razorpay order:", error);
    throw error;
  }
};

export const verifyPaymentSignatureAPI = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJSONResponse(response, "Payment signature verification failed");
  } catch (error) {
    console.error("API error verifying signature:", error);
    throw error;
  }
};

export const searchCertificatesAPI = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/search?query=${encodeURIComponent(query)}`);
    return await parseJSONResponse(response, "Certificate search failed");
  } catch (error) {
    console.error("API error searching certificates:", error);
    throw error;
  }
};

export const verifyCertificateAPI = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/verify/${encodeURIComponent(code)}`);
    return await parseJSONResponse(response, "Certificate verification failed");
  } catch (error) {
    console.error("API error verifying certificate code:", error);
    throw error;
  }
};

export const generateCertificateAPI = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJSONResponse(response, "Failed to generate certificate");
  } catch (error) {
    console.error("API error generating certificate:", error);
    throw error;
  }
};

export const deleteCertificateAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: "DELETE",
    });
    return await parseJSONResponse(response, "Failed to delete certificate");
  } catch (error) {
    console.error("API error deleting certificate:", error);
    throw error;
  }
};

export const getTeamsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    return await parseJSONResponse(response, "Failed to fetch teams");
  } catch (error) {
    console.error("API error fetching teams:", error);
    throw error;
  }
};

export const getAnnouncementsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`);
    return await parseJSONResponse(response, "Failed to fetch announcements");
  } catch (error) {
    console.error("API error fetching announcements:", error);
    throw error;
  }
};

export const createAnnouncementAPI = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJSONResponse(response, "Failed to create announcement");
  } catch (error) {
    console.error("API error creating announcement:", error);
    throw error;
  }
};

export const deleteAnnouncementAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
    });
    return await parseJSONResponse(response, "Failed to delete announcement");
  } catch (error) {
    console.error("API error deleting announcement:", error);
    throw error;
  }
};

// Coordinators Management APIs
export const getCoordinatorsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/coordinators`);
    return await parseJSONResponse(response, "Failed to fetch coordinators");
  } catch (error) {
    console.error('API error fetching coordinators:', error);
    throw error;
  }
};

export const createCoordinatorAPI = async (payload) => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/coordinators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    return await parseJSONResponse(response, "Failed to create coordinator");
  } catch (error) {
    console.error('API error creating coordinator:', error);
    throw error;
  }
};

export const deleteCoordinatorAPI = async (id) => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/coordinators/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await parseJSONResponse(response, "Failed to delete coordinator");
  } catch (error) {
    console.error('API error deleting coordinator:', error);
    throw error;
  }
};

export const sendContactMessageAPI = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await parseJSONResponse(response, "Failed to send contact message");
  } catch (error) {
    console.error("API error submitting contact message:", error);
    throw error;
  }
};

export const getContactMessagesAPI = async () => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/contact-messages`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await parseJSONResponse(response, "Failed to fetch contact messages");
  } catch (error) {
    console.error("API error fetching contact messages:", error);
    throw error;
  }
};

export const deleteContactMessageAPI = async (id) => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/contact-messages/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await parseJSONResponse(response, "Failed to delete contact message");
  } catch (error) {
    console.error("API error deleting contact message:", error);
    throw error;
  }
};

export const createManualRegistrationAPI = async (formData) => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/registrations/manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(formData),
    });
    return await parseJSONResponse(response, "Failed to create manual registration");
  } catch (error) {
    console.error("API error creating manual cash registration:", error);
    throw error;
  }
};

// Database Backup System APIs
export const getBackupHistoryAPI = async () => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/backups`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await parseJSONResponse(response, "Failed to fetch backup history");
  } catch (error) {
    console.error("API error fetching backup history:", error);
    throw error;
  }
};

export const createManualBackupAPI = async () => {
  const token = localStorage.getItem("ams_hackathon_2026_admin_token");
  try {
    const response = await fetch(`${API_BASE_URL}/admin/backups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await parseJSONResponse(response, "Failed to trigger manual backup");
  } catch (error) {
    console.error("API error creating manual backup:", error);
    throw error;
  }
};

export const getBackupDownloadUrl = (filename) => {
  return `${API_BASE_URL}/admin/backups/download/${encodeURIComponent(filename)}`;
};
