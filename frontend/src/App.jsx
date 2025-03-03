import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import {
  PublicRoute,
  AdminRoute,
  RegisterRoute,
  PrivateRoute,
} from "./components/protectedRoutes/PublicRoute";
import Users from "./components/dashboardComponents/Users";
import { GoogleOAuthProvider } from "@react-oauth/google";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
function App() {
  const GoogleAuthWrapper = ({ children }) => {
    return (
      <GoogleOAuthProvider clientId="640229268259-hg3fv9cf7idg7itvtsgnh97c29ftumtq.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
    );
  };
  return (
    <Router>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center text-lg">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GoogleAuthWrapper>
                <PublicRoute>
                  <Login />
                </PublicRoute>
              </GoogleAuthWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <GoogleAuthWrapper>
                <RegisterRoute>
                  <Register />
                </RegisterRoute>
              </GoogleAuthWrapper>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="users" element={<Users />} />
              <Route path="mails" element={<h1>hello mails</h1>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
