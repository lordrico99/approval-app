// src/admin/components/AdminHeader.js
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <nav className="space-x-4">
        <button onClick={() => navigate("/admin")} className="text-sm font-medium hover:underline">Dashboard</button>
        <button onClick={() => navigate("/admin/requests")} className="text-sm font-medium hover:underline">All Requests</button>
        <button onClick={() => navigate("/admin/approvals")} className="text-sm font-medium hover:underline">Approvals</button>
        <button onClick={() => navigate("/admin/new-request")} className="text-sm font-medium hover:underline">New Request</button>
        <button onClick={() => navigate("/admin/budget")} className="text-sm font-medium hover:underline">Annual Budget</button>
      </nav>
    </header>
  );
};

export default AdminHeader;
