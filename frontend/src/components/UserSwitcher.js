import React from "react";
import users from "../data/users";

export default function UserSwitcher({ activeUser, onUserSwitch }) {
  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <label htmlFor="user-switcher" style={{ marginRight: "0.5rem" }}>
        Switch User (Dev Only):
      </label>
      <select
        id="user-switcher"
        onChange={onUserSwitch}
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
}
