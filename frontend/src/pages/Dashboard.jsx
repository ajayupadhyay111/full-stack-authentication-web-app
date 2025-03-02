import LeftSideBar from "@/components/dashboardComponents/LeftSideBar";
import RightSideContent from "@/components/dashboardComponents/RightSideContent";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [active, setActive] = useState("");
  const location = useLocation().pathname.split("/");
  return (
    <>
      <Navbar />
      <div className="flex gap-2 overflow-hidden">
        <LeftSideBar active={location[location.length - 1]} />
        <RightSideContent>
          <Outlet />
        </RightSideContent>
      </div>
    </>
  );
};

export default Dashboard;
