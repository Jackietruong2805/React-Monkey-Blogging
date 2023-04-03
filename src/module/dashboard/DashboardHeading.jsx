import React from "react";

const DashboardHeading = ({ title = "", desc = "", children }) => {
  return (
    <div className="flex justify-between">
      <div className="mb-10">
        <h1 className="dashboard-heading">{title}</h1>
        <p className="dashboard-short-desc">{desc}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default DashboardHeading;