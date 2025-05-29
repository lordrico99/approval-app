// src/pages/admin/Approvals.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await axios.get("/api/approvals"); // Adjust route if needed
        setApprovals(response.data);
      } catch (error) {
        console.error("Failed to fetch approvals:", error);
      }
    };

    fetchApprovals();
  }, []);

  const departments = Array.from(
    new Set(approvals.map((req) => req.department).filter(Boolean))
  );

  const filterApprovals = (status) => {
    return approvals.filter(
      (req) =>
        req.status === status &&
        (selectedDepartment === "All" || req.department === selectedDepartment)
    );
  };

  const renderApprovals = (status) => (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {status} Requests
      </h2>
      {filterApprovals(status).map((approval) => (
        <div key={approval._id} className="bg-white rounded p-4 shadow mb-3">
          <p>
            <strong>Title:</strong> {approval.title}
          </p>
          <p>
            <strong>Submitted by:</strong>{" "}
            {approval.submittedBy?.email || approval.submittedBy || "Unknown"}
          </p>

          <p>
            <strong>Department:</strong> {approval.department}
          </p>
          <p>
            <strong>Amount:</strong> ${approval.amount}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(approval.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Approvals</h1>

      <div className="mb-4">
        <label className="font-medium text-gray-700">
          Filter by Department:
        </label>
        <select
          className="ml-2 px-3 py-1 border rounded"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="All">All</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {renderApprovals("Pending")}
      {renderApprovals("Approved")}
      {renderApprovals("Rejected")}
    </div>
  );
};

export default AdminApprovals;
