import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import departments from "../data/departments"; // keep this for filtering names
import UserSwitcher from "../components/UserSwitcher";
import users from "../data/users";
import BudgetChart from "../components/BudgetChart";
import BudgetChartContainer from "../components/BudgetChartContainer";

export default function AdminDashboard() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const isDev = process.env.NODE_ENV === "development";

  const [activeUser, setActiveUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [selectedDept, setSelectedDept] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for approved requests
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [approvedError, setApprovedError] = useState(null);

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

  // Fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/requests");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      console.log(
        "Fetching from:",
        `${process.env.REACT_APP_API_BASE_URL}/api/requests`
      );
      console.log("API base URL:", process.env.REACT_APP_API_BASE_URL);
    };

    fetchRequests();
  }, []);

  // Fetch approved requests
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setApprovedLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/requests/approved");
        if (!response.ok) throw new Error("Failed to fetch approved requests");
        const data = await response.json();
        setApprovedRequests(data);
        setApprovedError(null);
      } catch (err) {
        setApprovedError(err.message);
      } finally {
        setApprovedLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const username = activeUser?.name || activeUser?.email || "Admin";

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

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    cursor: "pointer",
    transition: "box-shadow 0.3s",
  };

  // Filter requests by selected department or show all
  const filteredRequests =
    selectedDept === "All"
      ? requests
      : requests.filter(
          (r) =>
            r.department &&
            (r.department._id === selectedDept || r.department === selectedDept)
        );

  // Helper to get department name safely
  const getDepartmentName = (dept) => {
    if (!dept) return "Unknown";
    if (typeof dept === "string") {
      // dept is id string
      const found = departments.find((d) => d.id === dept);
      return found ? found.name : "Unknown";
    }
    return dept.name || "Unknown"; // populated object
  };

  // Helper to get user name/email
  const getUserName = (submittedBy) => {
    if (!submittedBy) return "Unknown";
    return submittedBy.name || submittedBy.email || "Unknown";
  };

  const RequestList = ({ requests }) => (
    <ul
      style={{
        maxHeight: "200px",
        overflowY: "auto",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginTop: "1rem",
      }}
    >
      {requests.length === 0 ? (
        <li>No requests found.</li>
      ) : (
        requests.map((req) => (
          <li
            key={req._id}
            style={{
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <strong>{req.title}</strong> <br />
            From: {getUserName(req.submittedBy)} | Dept:{" "}
            {getDepartmentName(req.department)} | Amount: $
            {req.amount?.toLocaleString()}
          </li>
        ))
      )}
    </ul>
  );

  const filteredApprovedRequests =
  selectedDept === "All"
    ? approvedRequests
    : approvedRequests.filter(
        (r) =>
          r.department &&
          (r.department._id === selectedDept || r.department === selectedDept)
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
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1f2937",
          }}
        >
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
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#b91c1c")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc2626")
          }
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
            marginBottom: "2rem",
          }}
        >
          <div style={cardStyle} onClick={goToMyRequests}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              My Requests
            </h2>
            <p>View and manage your submitted requests.</p>
          </div>

          <div style={cardStyle} onClick={goToApprovals}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Approvals
            </h2>
            <p>Check and approve requests assigned to you.</p>
          </div>

          <div style={cardStyle} onClick={goToNewRequest}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              New Request
            </h2>
            <p>Create a new approval request.</p>
          </div>
        </div>

        {/* All Requests Section */}
        <section style={{ marginTop: "2rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "#1f2937",
            }}
          >
            Requests (
            {selectedDept === "All"
              ? "All Departments"
              : getDepartmentName(selectedDept)}
            )
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="department-filter"
              style={{ marginRight: "0.5rem" }}
            >
              Filter by Department:
            </label>
            <select
              id="department-filter"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ padding: "0.3rem 0.5rem", borderRadius: "0.25rem" }}
            >
              <option value="All">All</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading requests...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && <RequestList requests={filteredRequests} />}
        </section>

        {/* Approved Requests Section */}
        <section style={{ marginTop: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "#1f2937",
            }}
          >
            Approved Requests
          </h2>

          {approvedLoading && <p>Loading approved requests...</p>}
          {approvedError && <p style={{ color: "red" }}>{approvedError}</p>}

          {!approvedLoading && !approvedError && (
            <RequestList requests={filteredApprovedRequests} />
          )}
        </section>

        <BudgetChartContainer />
      </main>
      <UserSwitcher activeUser={activeUser} onUserSwitch={handleUserSwitch} />

    </div>
  );
}
