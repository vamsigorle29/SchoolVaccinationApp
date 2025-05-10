const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  STUDENTS: {
    LIST: `${API_BASE_URL}/students`,
    CREATE: `${API_BASE_URL}/api/students/create`,
    UPDATE: (id) => `${API_BASE_URL}/api/students/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/students/delete/${id}`,
    UPLOAD: `${API_BASE_URL}/api/students/upload`,
  },
  DRIVES: {
    LIST: `${API_BASE_URL}/api/drives`,
    CREATE: `${API_BASE_URL}/api/drives/create`,
    UPDATE: (id) => `${API_BASE_URL}/api/drives/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/drives/delete/${id}`,
  },
  DASHBOARD: {
    SUMMARY: `${API_BASE_URL}/api/dashboard/summary`,
    TODAY_DRIVES: `${API_BASE_URL}/api/dashboard/summary`,
  },
};

export default API_ENDPOINTS; 