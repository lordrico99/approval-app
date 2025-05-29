import React, { useEffect, useState } from "react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const currentUser = localStorage.getItem("user");

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
    const userRequests = allRequests.filter(
      (req) => req.submittedBy === currentUser
    );
    setRequests(userRequests);
  }, [currentUser]);

  useEffect(() => {
  let filtered = [];
  if (activeTab === "all") {
    filtered = [...requests];  // copy array
  } else {
    filtered = requests.filter((req) => req.status === activeTab);
  }

  // Sort by dateSubmitted descending (newest first)
  filtered.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));

  setFilteredRequests(filtered);
}, [activeTab, requests]);

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

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>My Requests</h1>

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

      {filteredRequests.length === 0 ? (
        <p>No {activeTab} requests submitted yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ fontWeight: "600" }}>{req.title}</h2>
              <p>
                <strong>Amount:</strong> ₦{req.amount.toLocaleString()}
              </p>
              <p>
                <strong>Description:</strong> {req.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      req.status === "approved"
                        ? "green"
                        : req.status === "rejected"
                          ? "red"
                          : "orange",
                  }}
                >
                  {req.status}
                </span>
              </p>
              <p>
                <strong>Approver:</strong> {req.approver}
              </p>
              <p>
                <strong>Submitted On:</strong> {req.dateSubmitted}
              </p>
              {req.attachment && (
                <p>
                  <strong>Attachment: </strong>
                  <a
                    href={req.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={req.attachmentName || "attachment"}
                  >
                    {req.attachmentName || "View Document"}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
