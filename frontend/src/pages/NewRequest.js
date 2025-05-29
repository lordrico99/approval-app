import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewRequest() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");

  const [remainingBudget, setRemainingBudget] = useState(() => {
    const savedBudget = localStorage.getItem("remainingBudget");
    return savedBudget ? parseFloat(savedBudget) : 1000000;
  });

  const [requestTitle, setRequestTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("File type not supported. Please upload image, PDF, Excel, or Word document.");
      e.target.value = null;
      return;
    }

    setAttachmentName(file.name);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (amountValue > remainingBudget) {
      alert("Amount exceeds remaining budget.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      title: requestTitle,
      amount: amountValue,
      description,
      status: "pending",
      submittedAt: new Date().toISOString(),
      submittedBy: currentUser,
      approver: "itsupport@fanplc.com",
      dateSubmitted: new Date().toLocaleString(),
      attachment,         // base64 file data
      attachmentName,     // original file name
    };

    const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
    allRequests.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(allRequests));

    const updatedBudget = remainingBudget - amountValue;
    setRemainingBudget(updatedBudget);
    localStorage.setItem("remainingBudget", updatedBudget.toString());

    alert(`Email sent to itsupport@fanplc.com: New request from ${currentUser}`);
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <h1>New Request</h1>

      <div style={{ background: "white", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
        <strong>Remaining Budget: </strong>
        <span style={{ color: remainingBudget < 1000 ? "red" : "green" }}>
          ₦{remainingBudget.toLocaleString()}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px" }}>
        <label>Request Title</label>
        <input
          type="text"
          value={requestTitle}
          onChange={(e) => setRequestTitle(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <label>Amount (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          max={remainingBudget}
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        ></textarea>

        <label>Attachment (Image, PDF, Excel, Docs)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "1rem" }}
        />
        {attachmentName && <p>Selected file: {attachmentName}</p>}

        <button type="submit" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "white" }}>
          Submit Request
        </button>
      </form>
    </div>
  );
}
