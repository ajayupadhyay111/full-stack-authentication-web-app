import { API } from "@/api/api";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/context/authContext";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, setUser, accessToken, setAccessToken } =
    useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await API.get("/getUserProfile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        console.log(error);
        if (error?.response?.status === 403 || error.response.status === 400) {
          navigate("/login");
        }
      }
    })();
  }, [setAccessToken]);
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />
    </div>
  );
};

export default Home;
