import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminHeader from "../../components/AdminHeader";
import DepartmentFilter from "../../components/DepartmentFilter";
import BudgetChart from "../../components/BudgetChart";
import sampleRequests from "../../data/sampleRequests";
import departments from "../../data/departments";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      router.push("/"); // redirect non-admins to user dashboard or homepage
    } else {
      setUser(storedUser);
    }
  }, [router]);

  const filteredRequests =
    selectedDept === "All"
      ? sampleRequests
      : sampleRequests.filter((r) => r.department === selectedDept);

  if (!user) return null; // prevent flicker

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>

        <div className="mb-6">
          <DepartmentFilter
            departments={departments}
            selected={selectedDept}
            onSelect={setSelectedDept}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Requests ({selectedDept})</h2>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-auto">
              {filteredRequests.map((req) => (
                <li key={req.id} className="py-2">
                  <p className="text-sm text-gray-700 font-medium">{req.title}</p>
                  <p className="text-xs text-gray-500">
                    From: {req.sender} | Dept: {req.department}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Budget vs Expenditure</h2>
            <BudgetChart />
          </div>
        </div>
      </div>
    </div>
  );
}
