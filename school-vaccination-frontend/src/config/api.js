const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  STUDENTS: {
    LIST: `${API_BASE_URL}/api/students`,
    GET: (id) => `${API_BASE_URL}/api/students/${id}`,
    CREATE: `${API_BASE_URL}/api/students`,
    BULK_CREATE: `${API_BASE_URL}/api/students/bulk`,
    UPDATE: (id) => `${API_BASE_URL}/api/students/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/students/${id}`,
    UPLOAD: `${API_BASE_URL}/api/students/upload`,
  },
  DRIVES: {
    LIST: `${API_BASE_URL}/api/drives`,
    TODAY: `${API_BASE_URL}/api/drives/today`,
    GET: (id) => `${API_BASE_URL}/api/drives/${id}`,
    CREATE: `${API_BASE_URL}/api/drives`,
    UPDATE: (id) => `${API_BASE_URL}/api/drives/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/drives/${id}`,
  },
  DASHBOARD: {
    SUMMARY: `${API_BASE_URL}/api/dashboard/summary`,
    GRADE_STATS: `${API_BASE_URL}/api/dashboard/grade-stats`,
  },
};

// Debug log
console.log('API Configuration:', {
  BASE_URL: API_BASE_URL,
  DRIVES_LIST: API_ENDPOINTS.DRIVES.LIST
});

export default API_ENDPOINTS; 