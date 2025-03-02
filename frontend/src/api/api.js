import axios from "axios";
let accessToken = localStorage.getItem("accessToken");
let tokenRefresh = localStorage.getItem("refreshToken");
export const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const login = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
export const refreshToken = () => API.post("/refresh");
export const logout = () => API.post("/logout");

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      error.response.data.refresh
    ) {
      try {
        // Call refresh token API
        const refreshRes = await axios.get(
          "http://localhost:4000/api/refreshToken",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearers ${tokenRefresh}`,
            },
          }
        );

        // Update token & retry  failed request
        localStorage.setItem("accessToken", refreshRes.data.accessToken);
        error.config.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Session expired, login again.");
      }
    }
    return Promise.reject(error);
  }
);
