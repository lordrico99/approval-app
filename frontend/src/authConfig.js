// src/authConfig.js

export const msalConfig = {
  auth: {
    clientId: "edf9c16f-e278-4c24-8361-b7232558d71a",       // Application (client) ID from Azure
    authority: "https://login.microsoftonline.com/fa1f9a52-2b3a-4618-9015-a16696a0d865", // Tenant ID or 'common' for multi-tenant
    redirectUri: "http://localhost:3000",  // Your redirect URI
  },
  cache: {
    cacheLocation: "localStorage",          // or 'sessionStorage'
    storeAuthStateInCookie: false,          // true if issues with IE/Edge
  },
};

export const loginRequest = {
  scopes: ["User.Read"],  // Permissions you want from Microsoft Graph, adjust as needed
};
