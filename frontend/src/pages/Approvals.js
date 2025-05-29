import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Approvals() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [allRequests, setAllRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  // Load requests assigned to the current approver
  const loadRequests = () => {
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const assignedRequests = requests.filter(
      (req) => req.approver === currentUser.email
    );
    setAllRequests(assignedRequests);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    const onPopState = () => {
      loadRequests();
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [currentUser]);

  const handleDecision = (id, decision) => {
    const updatedRequests = allRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: decision,
            decisionDate: new Date().toLocaleString(),
          }
        : req
    );
    setAllRequests(updatedRequests);

    const allSavedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    const updatedAllRequests = allSavedRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: decision,
            decisionDate: new Date().toLocaleString(),
          }
        : req
    );

    localStorage.setItem("requests", JSON.stringify(updatedAllRequests));
  };

  // Styles
  const tabStyle = (tab) => ({
    padding: "0.5rem 1rem",
    marginRight: "1rem",
    backgroundColor: activeTab === tab ? "#2563eb" : "#e5e7eb",
    color: activeTab === tab ? "white" : "black",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  });

  const cardStyle = {
    background: "white",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    marginBottom: "1rem",
  };

  const statusStyle = {
    approved: { color: "#16a34a", fontWeight: "bold" },
    rejected: { color: "#dc2626", fontWeight: "bold" },
    pending: { color: "#f59e0b", fontWeight: "bold" },
  };

  const headerStyle = {
    borderBottom: "1px solid #ccc",
    padding: "0.25rem",
    textAlign: "left",
  };

  const cellStyle = { padding: "0.25rem" };

  const filteredRequests = allRequests.filter(
    (req) => req.status.toLowerCase() === activeTab
  );

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
        }}
      >
        Requests for Your Approval
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        {["pending", "approved", "rejected"].map((tab) => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No {activeTab} requests assigned to you.
        </p>
      ) : (
        filteredRequests.map((req) => (
          <div key={req.id} style={cardStyle}>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              {req.title || req.purpose}
            </h3>
            <p>
              <strong>Amount:</strong> ₦{Number(req.amount).toLocaleString()}
            </p>
            <p>
              <strong>Purpose:</strong> {req.purpose}
            </p>

            {/* Submitted By Table */}
            <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              <strong>Submitted By:</strong>
              {(() => {
                let submitted = "";
                let name = "N/A";
                let dept = "N/A";

                const submittedBy = req.submittedBy;

                if (typeof submittedBy === "string") {
                  try {
                    const parsed = JSON.parse(submittedBy);
                    submitted = parsed.email || submittedBy;
                    name = parsed.name || "N/A";
                    dept = parsed.department || "N/A";
                  } catch {
                    submitted = submittedBy;
                  }
                } else if (typeof submittedBy === "object") {
                  submitted = submittedBy.email || "Unknown";
                  name = submittedBy.name || "N/A";
                  dept = submittedBy.department || "N/A";
                }

                return (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "0.25rem",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={headerStyle}>Email</th>
                        <th style={headerStyle}>Name</th>
                        <th style={headerStyle}>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={cellStyle}>{submitted}</td>
                        <td style={cellStyle}>{name}</td>
                        <td style={cellStyle}>{dept}</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <p>
              <strong>
                {req.status === "pending"
                  ? "Sent on:"
                  : req.status === "approved"
                  ? "Approved on:"
                  : "Rejected on:"}
              </strong>{" "}
              {req.status === "pending"
                ? req.createdAt
                : req.decisionDate || "N/A"}
            </p>

            {req.status === "pending" ? (
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => handleDecision(req.id, "approved")}
                  style={{
                    marginRight: "0.75rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req.id, "rejected")}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p style={statusStyle[req.status]}>
                Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
