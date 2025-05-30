import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const BUDGET_PER_DEPARTMENT = 1000000;

function calculateBudgetAndExpenditure(requests = [], departments = []) {
  const expenditureMap = {};
  departments.forEach(dep => {
    expenditureMap[dep.id] = 0;
  });

  requests.forEach(req => {
    if (req.status === "approved") {
  const deptId = typeof req.department === "string" ? req.department : req.department._id;
  if (expenditureMap.hasOwnProperty(deptId)) {
    expenditureMap[deptId] += req.amount;
  }
}

  });

  return departments.map(dep => ({
    department: dep.name,
    budget: BUDGET_PER_DEPARTMENT,
    expenditure: expenditureMap[dep.id] || 0,
  }));
}


export default function BudgetChart({ requests, departments }) {
  const data = calculateBudgetAndExpenditure(requests, departments);

  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="department" />
      <YAxis />
      <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
      <Legend />
      <Bar dataKey="budget" fill="#8884d8" />
      <Bar dataKey="expenditure" fill="#82ca9d" />
    </BarChart>
  );
}
