const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export const apiCall = async (endpoint, method = 'GET', data = null, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const options = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_URL}${endpoint}`, options);

      // Handle different status codes
      if (response.status === 401) {
        // If it's a login attempt, don't clear session/redirect, just throw error
        if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(401, errorData.message || 'Authentication failed');
        }

        // Unauthorized - clear auth (but don't redirect to root to avoid loops)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new APIError(401, 'Session expired. Please login again.');
      }

      if (response.status === 403) {
        throw new APIError(403, 'You do not have permission to access this resource');
      }

      if (response.status === 404) {
        throw new APIError(404, 'Resource not found');
      }

      if (response.status >= 400) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        let details = null;

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          details = errorData.details;
        } catch {
          // Response was not JSON
        }

        throw new APIError(response.status, errorMessage, details);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const isNetworkError = error instanceof TypeError;
      const isAPIError = error instanceof APIError;

      if (isLastAttempt) {
        console.error(`API call failed after ${retries} attempts:`, error);
        throw error;
      }

      // Only retry on network errors or 5xx server errors
      if (!isNetworkError && isAPIError && error.status < 500) {
        throw error;
      }

      console.warn(`API call attempt ${attempt} failed. Retrying...`, error.message);
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Helper function for authenticated requests
export const apiCallAuth = (endpoint, method = 'GET', data = null) => {
  return apiCall(endpoint, method, data).catch(error => {
    if (error instanceof APIError && error.status === 401) {
      // Already handled in apiCall
      throw error;
    }
    throw error;
  });
};

// Helper to format error messages
export const getErrorMessage = (error) => {
  if (error instanceof APIError) {
    return error.message;
  }
  if (error instanceof TypeError) {
    // Check if it's a network error
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      return 'Cannot connect to server. Please check:\n1. Backend server is running (npm run dev in backend folder)\n2. Backend URL is correct in .env file\n3. Your internet connection';
    }
    return 'Network error. Please check your connection.';
  }
  return error.message || 'An unknown error occurred';
};

// Add a function to check backend health
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
