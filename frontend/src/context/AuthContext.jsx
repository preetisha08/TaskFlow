import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("taskflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const register = async (formData) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("taskflow_token", response.data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(response.data.user));

      setUser(response.data.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("taskflow_token", response.data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(response.data.user));

      setUser(response.data.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
