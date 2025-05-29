import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";
import UserSwitcher from "../components/UserSwitcher";

export default function Dashboard() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const isDev = process.env.NODE_ENV === "development";

  const [activeUser, setActiveUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const accounts = instance.getAllAccounts();
  const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    if (isDev && activeUser && !activeAccount) {
      const mockAccount = {
        username: activeUser.email,
        name: activeUser.name || activeUser.email,
        homeAccountId: activeUser.email,
      };
      instance.setActiveAccount(mockAccount);
    }
  }, [activeUser, activeAccount, instance, isDev]);

  const handleLogout = () => {
    if (!isDev) {
      instance
        .logoutRedirect({ account: activeAccount })
        .catch((e) => console.error(e));
    } else {
      localStorage.removeItem("user");
      setActiveUser(null);
      instance.setActiveAccount(null);
      navigate("/");
    }
  };

  const handleUserSwitch = (e) => {
    const selectedEmail = e.target.value;
    const newUser = users.find((u) => u.email === selectedEmail);
    if (!newUser) return;

    localStorage.setItem("user", JSON.stringify(newUser));
    setActiveUser(newUser);

    if (isDev) {
      const mockAccount = {
        username: newUser.email,
        name: newUser.name || newUser.email,
        homeAccountId: newUser.email,
      };
      instance.setActiveAccount(mockAccount);
    }

    if (newUser.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const goToMyRequests = () => navigate("/my-requests");
  const goToApprovals = () => navigate("/approvals");
  const goToNewRequest = () => navigate("/request");

  const username = activeUser?.name || activeUser?.email || "User";

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    cursor: "pointer",
    transition: "box-shadow 0.3s",
  };

  const UserSwitcher = () => (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <label htmlFor="user-switcher" style={{ marginRight: "0.5rem" }}>
        Switch User (Dev Only):
      </label>
      <select
        id="user-switcher"
        onChange={handleUserSwitch}
        value={activeUser?.email || ""}
      >
        <option value="" disabled>
          Select a user
        </option>
        {users.map((user) => (
          <option key={user.email} value={user.email}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>
          Welcome, {username}
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            border: "none",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={cardStyle}
            onClick={goToMyRequests}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
            }
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              My Requests
            </h2>
            <p>View and manage your submitted requests.</p>
          </div>

          <div
            style={cardStyle}
            onClick={goToApprovals}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
            }
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              Approvals
            </h2>
            <p>Check and approve requests assigned to you.</p>
          </div>

          <div
            style={cardStyle}
            onClick={goToNewRequest}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")
            }
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              New Request
            </h2>
            <p>Submit a new request for approval.</p>
          </div>
        </div>

        {isDev && <UserSwitcher />}
      </main>
    </div>
  );
}
