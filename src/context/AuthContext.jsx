import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Create axios instance with default config

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleSuccessfulAuth = (userData) => {
    // Đảm bảo lưu đầy đủ thông tin user
    const userToSave = {
      ...userData,
      name: userData.name || userData.email,
      avatar: userData.avatar || null,
      email: userData.email,
      role: userData.role,
    };

    setUser(userToSave);
    localStorage.setItem("user", JSON.stringify(userToSave));


    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user/dashboard"); 
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login API response:", response.data);

      if (response.data.user && response.data.user.token) {
        const userData = response.data.user;
        api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
        setUser(userData);
        setIsAuthModalOpen(false);
        handleSuccessfulAuth(userData);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Google Response:", credentialResponse); // Debug log

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      console.log("Server Response:", response.data); // Debug log
      console.log(response.data.user);
      handleSuccessfulAuth(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error("Google login error details:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Google login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const resonse = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (resonse.data) {
        alert("Registration successful! Please log in.");
      } else {
        throw new Error("Register failed");
      }
    } catch (error) {
      console.log("Register error:", error);
      const message =
        error.resonse?.data?.message || error.message || "Registration failed";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear user data first
      setUser(null);
      localStorage.removeItem("user");

      // Then make the logout request
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Send token in header
          },
        }
      );

      // Navigate after successful logout
      navigate("/");
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
      // Even if the request fails, we still want to clear local data
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  //forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err) {
      console.error("Forgot password error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update user data
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser, // Provide setUser function
        login,
        register,
        handleGoogleLogin,
        logout,
        forgotPassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loading,
        error,
        isAuthenticated: () => !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
