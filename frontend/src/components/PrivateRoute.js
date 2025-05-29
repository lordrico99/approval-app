// src/components/PrivateRoute.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();

  if (accounts.length > 0) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}
