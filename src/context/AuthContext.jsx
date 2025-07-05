import React, { createContext, useContext, useState } from "react";

// Add as many users as you want for each type
const users = [
  { role: "admin", email: "admin@vms.com", password: "Admin@123" },
  { role: "admin", email: "admin2@vms.com", password: "Admin2@123" },
  { role: "soldier", email: "soldier@vms.com", password: "Soldier@123" },
  { role: "soldier", email: "soldier2@vms.com", password: "Soldier2@123" },
  { role: "user", email: "host@vms.com", password: "Host@123" },
  { role: "user", email: "host2@vms.com", password: "Host2@123" },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const found = users.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.password === password
    );
    if (found) {
      setUser(found);
      return found;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}