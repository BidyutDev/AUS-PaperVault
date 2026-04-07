import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("vaultUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("vaultUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (emailOrUsername, password) => {
    const userData = {
      emailOrUsername,
      loginTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem("vaultUser", JSON.stringify(userData));
  };

  const signup = (signupData) => {
    const userData = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      username: signupData.username,
      emailOrUsername: signupData.email,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
      signupTime: new Date().toISOString(),
      loginTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem("vaultUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vaultUser");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
