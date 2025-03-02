import React from "react";
import { useLocation } from "react-router-dom";

const RightSideContent = ({ children }) => {
  return <div className="p-3 h-[calc(100ch-70px)]">{children}</div>;
};

export default RightSideContent;
