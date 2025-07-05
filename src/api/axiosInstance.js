import axios from "axios";

// define the base url
export const baseURL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Declare a variable to hold the access token
let accessToken = null;

// A function to update the token else where in the program
export const setAccessToken = (token) => {
  accessToken = token;
};

// Intercept all requests to attach the token in the authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // check if the access token is present
    if (accessToken) {
      // then we set it in the Authorization header of the request
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Always return the config object
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept all responses and  retry if a 404 jwt-expired error is sent back
axiosInstance.interceptors.response.use(
  (res) => res,
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

        accessToken = res.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
