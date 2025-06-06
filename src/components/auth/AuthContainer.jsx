import React, { useState } from "react";
import ColourfulText from "../ui/ColourfulText";
import { useAuth } from "../../context/AuthContext";


const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, loading, error } = useAuth(); // Add useAuth hook
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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
    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      console.error("Login failed:", err);
    }
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
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 mb-3 rounded bg-gray-500/20 backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 mb-3 rounded bg-gray-500/20 backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-2 mb-3 rounded bg-gray-500/20 backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none"
                />
                <button className="bg-indigo-600 text-white px-6 py-2 rounded mb-3 transition-transform transform hover:scale-105 duration-200 w-[215px] h-[45px]">
                  Sign Up
                </button>
                <button className="flex items-center justify-center border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 hover:border-indigo-500 transition transform hover:scale-105 duration-200 text-gray-800 w-auto max-w-[250px]">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Sign In with Google
                </button>
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
                    className="w-full p-2 mb-3 rounded bg-gray-500/20 backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none"
                  />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    className="w-full p-2 mb-3 rounded bg-gray-500/20 backdrop-blur-sm placeholder-text-gray-200 text-gray-800 focus:outline-none"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                  )}
                  <span className="text-gray-600 mb-3 text-right w-full block">
                    Forgot Password?
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded mb-3 transition-transform transform hover:scale-105 duration-200 w-[215px] h-[45px] disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <button className="flex items-center justify-center border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 hover:border-indigo-500 transition transform hover:scale-105 duration-200 text-gray-800 w-auto max-w-[250px]">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Sign In with Google
                </button>
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
