import React, { useEffect, useState } from "react";
import {
  Users,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const LeftSideBar = ({active}) => {
  return (
    <div className=" h-[calc(100vh-70px)] lg:w-64 w-12 bg-white text-gray-900 border-r border-gray-300 shadow-md">
      <nav className="mt-5">
        <ul>
          <li
            className={`p-3 hover:bg-gray-100 ${
              active === "users" ? "bg-gray-200 hover:bg-gray-200" : "bg-white"
            }`}
          >
            <Link to="/dashboard/users" className="flex items-center space-x-2">
              <Users size={20} />
              <span className={`hidden lg:block`}>Users</span>
            </Link>
          </li>
          <li
            className={`p-3 hover:bg-gray-100 ${
              active === "mails" ? "bg-gray-200 hover:bg-gray-200" : "bg-white"
            }`}
          >
            <Link to="/dashboard/mails" className="flex items-center space-x-2">
              <Mail size={20} />
              <span className={`hidden lg:block`}>Mail</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftSideBar;
