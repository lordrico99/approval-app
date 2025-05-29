import React from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance
      .loginPopup()
      .then((response) => {
        const account = response.account || instance.getActiveAccount();
        if (account) {
          localStorage.setItem("currentUser", account.username); // ✅ sets logged-in email automatically
          navigate("/dashboard");
        } else {
          console.error("Login succeeded, but no account info found.");
        }
      })
      .catch((e) => {
        console.error("Login error:", e);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6", // Tailwind gray-100
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Company logo placeholder */}
        <img
          src="/FAN logo 2.png" // Make sure this path is correct relative to your public folder
          alt="Company Logo"
          style={{ width: "200px", marginBottom: "1.5rem" }}
        />

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#1f2937", // gray-800
            marginBottom: "1rem",
          }}
        >
          Welcome to FANPLC Approval App
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#4b5563", // gray-600
            marginBottom: "2rem",
          }}
        >
          Please sign in with your Microsoft account to continue.
        </p>

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#2563eb", // blue-600
            color: "white",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
            transition: "background-color 0.3s ease",
            width: "100%",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1e40af")
          } // blue-800
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
