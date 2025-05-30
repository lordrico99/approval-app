import React, { useEffect, useState } from "react";

export default function Approvals() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [allRequests, setAllRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/requests");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();

        // Map backend data to frontend expected format
        const mapped = data.map((req) => ({
          id: req._id,
          title: req.title,
          description: req.description,
          amount: req.amount || 0,
          status: req.status.toLowerCase(),
          approver: req.approver || "", // Adjust if your backend includes this field
          submittedBy: {
            email: req.requesterEmail || "unknown",
            name: req.requesterName || "N/A",
            department: req.department || "N/A",
          },
          dateSubmitted: req.dateSubmitted,
        }));

        // Filter requests assigned to current user by approver email
        const assignedRequests = mapped.filter(
          (req) => req.approver === currentUser.email
        );

        setAllRequests(assignedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        alert("Failed to fetch approved requests");
      }
    };

    fetchRequests();
  }, [currentUser]);

  const handleDecision = async (id, decision) => {
    try {
      // Send approval/rejection decision to backend API
      const response = await fetch(`http://localhost:5000/api/requests/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision }),
      });

      if (!response.ok) throw new Error("Failed to update request");

      // Optionally, you could re-fetch requests here or update state locally
      // For now, just re-fetch all requests:
      const updatedResponse = await fetch("http://localhost:5000/api/requests");
      const updatedData = await updatedResponse.json();

      const mapped = updatedData.map((req) => ({
        id: req._id,
        title: req.title,
        description: req.description,
        amount: req.amount || 0,
        status: req.status.toLowerCase(),
        approver: req.approver || "",
        submittedBy: {
          email: req.requesterEmail || "unknown",
          name: req.requesterName || "N/A",
          department: req.department || "N/A",
        },
        dateSubmitted: req.dateSubmitted,
      }));

      const assignedRequests = mapped.filter(
        (req) => req.approver === currentUser.email
      );

      setAllRequests(assignedRequests);

      alert(`Request ${id} has been ${decision}.`);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request status.");
    }
  };

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

  const filteredRequests = allRequests
    .filter((req) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return req.status === "pending";
      if (activeTab === "approved") return req.status === "approved";
      if (activeTab === "rejected") return req.status === "rejected";
      return true;
    })
    .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));

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

      {/* Filter Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button style={tabStyle("all")} onClick={() => setActiveTab("all")}>
          All
        </button>
        <button
          style={tabStyle("pending")}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          style={tabStyle("approved")}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          style={tabStyle("rejected")}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Requests List */}
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
              {req.title}
            </h3>
            <p>
              <strong>Amount:</strong> ₦{req.amount.toLocaleString()}
            </p>
            <p>
              <strong>Description:</strong> {req.description}
            </p>

            {/* Submitted By Section */}
            <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              <strong>Submitted By:</strong>
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
                    <td style={cellStyle}>{req.submittedBy.email}</td>
                    <td style={cellStyle}>{req.submittedBy.name}</td>
                    <td style={cellStyle}>{req.submittedBy.department}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong>Date Submitted:</strong>{" "}
              {req.dateSubmitted
                ? new Date(req.dateSubmitted).toLocaleString()
                : "N/A"}
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
