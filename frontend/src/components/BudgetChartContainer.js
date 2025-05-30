import React, { useEffect, useState } from "react";
import BudgetChart from "./BudgetChart";

export default function BudgetChartContainer() {
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([
    { id: "sales", name: "Sales" },
    { id: "marketing", name: "Marketing" },
    { id: "hr", name: "HR" },
    { id: "it", name: "IT" },
    // Add more departments here or fetch from backend
  ]);

  useEffect(() => {
    async function fetchApprovedRequests() {
      try {
        const res = await fetch("http://localhost:5000/api/requests/approved");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    }

    fetchApprovedRequests();
  }, []);

  return <BudgetChart requests={requests} departments={departments} />;
}
