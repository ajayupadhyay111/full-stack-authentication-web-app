import { API } from "@/api/api";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const { accessToken,setAccessToken } = useContext(AuthContext);
  if (!accessToken) {
    let promise = new Promise((resolve, reject) => {
      API.get("/refreshToken")
        .then((refreshRes) => resolve(refreshRes.data)) // Resolve with data
        .catch((error) => reject(error)); // Reject if an error occurs
    });
  
    promise
      .then((res) => setAccessToken( res.accessToken))
      .catch((err) => console.log("Error:", err));
  }
  return !accessToken ? children : <Navigate to={"/"} />;
};

export const RegisterRoute = ({ children }) => {
  const { accessToken,setAccessToken } = useContext(AuthContext);
  if (!accessToken) {
    let promise = new Promise((resolve, reject) => {
      API.get("/refreshToken")
        .then((refreshRes) => resolve(refreshRes.data)) // Resolve with data
        .catch((error) => reject(error)); // Reject if an error occurs
    });
  
    promise
      .then((res) => setAccessToken( res.accessToken))
      .catch((err) => console.log("Error:", err));
  }
  return !accessToken ? children : <Navigate to={"/"} />;
};

export const PrivateRoute = ({ children }) => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  if (!accessToken) {
    let promise = new Promise((resolve, reject) => {
      API.get("/refreshToken")
        .then((refreshRes) => resolve(refreshRes.data)) // Resolve with data
        .catch((error) => reject(error)); // Reject if an error occurs
    });
  
    promise
      .then((res) => setAccessToken( res.accessToken))
      .catch((err) => console.log("Error:", err));
  }
  return children
  
};

export const AdminRoute = ({ children }) => {
  const { user, accessToken } = useContext(AuthContext);
  return accessToken && user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} />
  );
};
