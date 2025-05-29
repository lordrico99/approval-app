// src/admin/components/DepartmentFilter.js
import React from "react";

const departments = ["All", "IT", "Sales", "HR", "Finance", "Operations"];

const DepartmentFilter = ({ current, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {departments.map((dept) => (
        <button
          key={dept}
          onClick={() => onChange(dept)}
          className={`px-4 py-2 rounded-lg ${
            current === dept ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {dept}
        </button>
      ))}
    </div>
  );
};

export default DepartmentFilter;
