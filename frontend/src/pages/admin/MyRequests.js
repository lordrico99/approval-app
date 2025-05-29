// src/pages/admin/MyRequests.js
import React from "react";
import sampleRequests from "../../data/sampleRequests";

const MyRequests = () => {
  const currentUser = localStorage.getItem("user") || "bob@example.com";
  const myRequests = sampleRequests.filter(r => r.sender === currentUser);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Requests</h2>
      <div className="space-y-4">
        {myRequests.map(req => (
          <div key={req.id} className="bg-white shadow p-4 rounded-xl">
            <h3 className="text-xl font-bold">{req.title}</h3>
            <p>Department: {req.department}</p>
            <p>Status: {req.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
