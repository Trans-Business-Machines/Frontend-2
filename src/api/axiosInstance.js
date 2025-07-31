import axios from "axios";

// Base URL for your backend
export const baseURL = "https://vms-yj7f.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// In-memory token (for current session)
let accessToken = null;

//  Function to set token both in memory 
export const setAccessToken = (token) => {
  accessToken = token;
};

// Automatically attach token to all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } 
    return config;
  },
  (error) => Promise.reject(error)
);

//  Handle JWT expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isJwtExpired =
      error.response?.status === 401 &&
      error.response?.data?.error?.message === "jwt expired";

    if (isJwtExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Save new token in memory 
        const newToken = res.data.accessToken;
        setAccessToken(newToken);

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
