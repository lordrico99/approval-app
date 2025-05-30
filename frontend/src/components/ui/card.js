import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`text-gray-800 ${className}`} {...props}>
      {children}
    </div>
  );
}
