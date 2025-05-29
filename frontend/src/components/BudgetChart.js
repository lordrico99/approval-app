// src/components/DashboardChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BudgetChart = () => {
  const data = [
    { department: "Sales", budget: 120000, expenditure: 85000 },
    { department: "IT", budget: 90000, expenditure: 70000 },
    { department: "Procurement", budget: 60000, expenditure: 40000 },
    { department: "Admin", budget: 50000, expenditure: 30000 },
    { department: "Operations", budget: 100000, expenditure: 75000 },
  ];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#8884d8" />
          <Bar dataKey="expenditure" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
