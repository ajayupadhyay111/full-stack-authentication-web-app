import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
export const PublicRoute = ({ children }) => {
  return !accessToken ? children : <Navigate to={"/"} />;
};

export const RegisterRoute = ({ children }) => {
  return !refreshToken ? children : <Navigate to={"/"} />;
};


export const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === "admin" ? (
    <Outlet />
  ) : accessToken && user?.role === "user" ? (
    <Navigate to={"/"} />
  ) : (
    <Navigate to={"/login"} />
  );
};
