import React, { useEffect, useRef, useState } from "react";
import ColourfulText from "../ui/ColourfulText";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, handleGoogleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { token } = useParams();
  const hasVerified = useRef(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (token && !hasVerified.current) {
        hasVerified.current = true;
        try {
          const response = await api.get(
            `/auth/verify/${token}`
          );
          if (response.status === 200) {
            alert("Email verified successfully. Please login.");
            navigate("/login");
          }
        } catch (error) {
          alert(error.response?.data?.message || "Verification failed");
          navigate("/login");
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // Handle input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Reset error message
    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 401) {
        setLoginError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setLoginError("Account not found");
      } else {
        setLoginError(err.response?.data?.message || "Login failed. Please try again.");
      }
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setRegisterError(""); // Reset error message
  
  if (registerData.password !== registerData.confirmPassword) {
    setRegisterError("Passwords do not match");
    return;
  }

  if (registerData.password.length < 6) {
    setRegisterError("Password must be at least 6 characters long");
    return;
  }

  try {
    await register(registerData.name, registerData.email, registerData.password);
  } catch (err) {
    console.error("Registration failed:", err);
    if (err.response?.status === 409) {
      setRegisterError("Email already exists");
    } else {
      setRegisterError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  }
};

  // Thêm hàm xử lý Google login
  const onGoogleLoginSuccess = async (credentialResponse) => {
    try {
      await handleGoogleLogin(credentialResponse);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const onGoogleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="relative w-[900px] h-[500px] overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-full h-full z-10">
            {/* Sign Up Form */}
            <div
              className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-0 z-30" : "-translate-x-full z-10"
              }`}
            >
              <div className="w-full h-full flex flex-col justify-center items-center p-10 bg-white">
                <h2 className="text-3xl font-bold mb-6">
                  <ColourfulText text="Sign Up" />
                </h2>
                <form onSubmit={handleRegisterSubmit} className="w-full">
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Name"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      registerError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Email"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      registerError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Password"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      registerError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm Password"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      registerError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  {registerError && (
                    <div className="mb-3 text-sm text-red-500 bg-red-100 p-2 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {registerError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded mb-3 transition-transform transform hover:scale-105 duration-200 w-[215px] h-[45px] disabled:opacity-50 ml-20"
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>
                </form>

                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={onGoogleLoginError}
                    useOneTap
                    shape="rectangular"
                    size="large"
                    width="250px"
                    text="signin_with"
                    locale="en"
                  />
                </div>
              </div>
            </div>

            {/* Sign In Form */}
            <div
              className={`absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-full z-10" : "translate-x-0 z-30"
              }`}
            >
              <div className="w-full h-full flex flex-col justify-center items-center p-10 bg-white">
                <h2 className="text-3xl font-bold mb-6">
                  <ColourfulText text="Sign In" />
                </h2>
                <form onSubmit={handleLoginSubmit} className="w-full">
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Email"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      loginError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    className={`w-full p-2 mb-3 rounded backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none ${
                      loginError ? 'border-red-500 bg-red-50' : 'bg-gray-500/20'
                    }`}
                  />
                  {loginError && (
                    <div className="mb-3 text-sm text-red-500 bg-red-100 p-2 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginError}
                    </div>
                  )}
                  <Link to="/reset-password" className="block text-right mb-3">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer transition-colors duration-200">
                      Forgot Password?
                    </span>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded mb-3 transition-transform transform hover:scale-105 duration-200 w-[215px] h-[45px] disabled:opacity-50 ml-20"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={onGoogleLoginError}
                    useOneTap
                    shape="rectangular"
                    size="large"
                    width="250px"
                    text="signin_with"
                    locale="en"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-1000 ease-in-out z-20 ${
              isSignUp ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white p-10">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                  {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
                </h2>
                <p>
                  {isSignUp
                    ? "Enter your personal details to use all of site features"
                    : "Register with your personal details to use all of site features"}
                </p>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="border border-white px-6 py-2 rounded hover:bg-white hover:text-purple-600 transition"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
