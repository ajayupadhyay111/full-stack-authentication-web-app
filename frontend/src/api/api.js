import { AuthContext } from "@/context/authContext";
import axios from "axios";
import { useContext } from "react";

export const API = axios.create({
  baseURL: "https://full-stack-authentication-web-app.onrender.com/api",
  withCredentials: true,
});

export const login = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
export const refreshToken = () => API.post("/refresh");
export const googleAuth = (code)=>API.get(`/google?code=${code}`)

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error.response
    );
    if (error.response?.status === 403 && error.response?.data.refresh) {
      try {
        // Call refresh token API
        const refreshRes = await axios.get(
          "http://localhost:4000/api/refreshToken",
          {
            withCredentials: true,
          }
        );

        // Update token & retry  failed request
        error.config.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Session expired, login again.");
      }
    }
    return Promise.reject(error);
  }
);
