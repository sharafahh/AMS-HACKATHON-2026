const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const adminLoginAPI = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Admin login failed");
    }
    return data;
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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment order");
    }
    return data;
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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Payment signature verification failed");
    }
    return data;
  } catch (error) {
    console.error("API error verifying signature:", error);
    throw error;
  }
};

export const searchCertificatesAPI = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Certificate search failed");
    }
    return data;
  } catch (error) {
    console.error("API error searching certificates:", error);
    throw error;
  }
};

export const verifyCertificateAPI = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/verify/${encodeURIComponent(code)}`);
    return await response.json();
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
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error("API error deleting certificate:", error);
    throw error;
  }
};

export const getTeamsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    return await response.json();
  } catch (error) {
    console.error("API error fetching teams:", error);
    throw error;
  }
};

export const getAnnouncementsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`);
    return await response.json();
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
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error("API error deleting announcement:", error);
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send contact message");
    }
    return data;
  } catch (error) {
    console.error("API error submitting contact message:", error);
    throw error;
  }
};

