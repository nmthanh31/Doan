import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../interfaces/UserProps";

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (userData: User, token: string) => {
    console.log("Saving token to localStorage:", token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    setUser(userData);
    navigate("/products");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Không tìm thấy token!");
    }

    if (token) {
      axios
        .get("http://localhost:3001/api/users/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const userData = res.data as { user: User };
          localStorage.setItem("userId", userData.user.id);
          setUser(userData.user);
        })
        .catch((err) => {
          console.error(
            "Failed to load user from token:",
            err.response?.data || err
          );
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
