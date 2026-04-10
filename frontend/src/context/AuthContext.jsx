import { createContext, useState, useContext, useEffect } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        try {
          const data = await apiFetch("/user/profile", "GET", {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });

          setUser({
            username: data.username,
            email: data.email,
            role: data.role,
          });
        } catch (err) {
          console.error("Failed to parse stored user:", err);
          localStorage.removeItem("access_token");
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const data = await apiFetch("/user/login", "POST", {
        body: {
          identifier: emailOrUsername,
          password: password,
        },
      });
      if (!data.success) {
        return { success: false, error: data.message };
      }
      setUser({ username: data.username, email: data.email, role: data.role });
      localStorage.setItem("access_token", data.token);
      return { success: true, token: data.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signup = async (signupData) => {
    try {
      const data = await apiFetch("/user/register", "POST", {
        body: {
          firstName: signupData.firstName.trim(),
          lastName: signupData.lastName.trim(),
          username: signupData.username.trim(),
          email: signupData.email.trim(),
          phoneNumber: signupData.phoneNumber.replace(/\D/g, ""),
          password: signupData.password.trim(),
        },
      });

      if (!data.success) {
        return { success: false, error: data.message };
      }

      setUser({ username: data.username, email: data.email, role: data.role });
      localStorage.setItem("access_token", data.token);
      return { success: true, token: data.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
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
