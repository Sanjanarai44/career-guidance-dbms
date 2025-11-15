const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle network errors
    if (!response) {
      throw new Error('Cannot connect to server. Make sure the backend server is running on port 5000.');
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      // If it's HTML, it's likely an error page
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error(`Server returned HTML instead of JSON. The endpoint may not exist or the server needs to be restarted. Status: ${response.status}`);
      }
      throw new Error(`Unexpected response format. Expected JSON but got: ${contentType}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Handle fetch errors (network issues, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend server is running. Run "npm run server" in a separate terminal.');
    }
    // Re-throw if it's already our custom error
    if (error.message && (error.message.includes('HTML') || error.message.includes('JSON'))) {
      throw error;
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Student API
export const studentAPI = {
  getProfile: async () => {
    return apiRequest('/users/student', {
      method: 'GET',
    });
  },
  updateProfile: async (profileData) => {
    return apiRequest('/users/student', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  getAcademicRecords: async () => {
    return apiRequest('/users/academic-records', {
      method: 'GET',
    });
  },
  addAcademicRecord: async (recordData) => {
    return apiRequest('/users/academic-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },
  getSkills: async () => {
    return apiRequest('/users/skills', {
      method: 'GET',
    });
  },
};

export default apiRequest;

