import React, { useState } from "react";
import axios from "axios";

interface AuthPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Login({ setIsAuthenticated }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Update app state
      setIsAuthenticated(true);

    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* LEFT */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <div className="mb-12">
            <h1 className="text-white text-sm mb-1 flex items-center gap-2">
               MU SOCIAL.
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-4xl mb-3">Login to your account</h2>
            <p className="text-gray-400">
              Enter your email below to login to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-white block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5757]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-white block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5757]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold 
                        bg-gradient-to-r from-[#ff5757] to-[#ff3b3b] 
                        text-white 
                        hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}
            <p className="text-center text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-white underline">
                Sign up
              </a>
            </p>

          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            <div className="relative">
              <div className="text-[200px] text-[#ff5757] font-bold">M</div>
              <div className="absolute top-0 right-0 text-[200px] text-[#ff5757] opacity-80 font-bold">U</div>
            </div>
          </div>
          <h1 className="text-white text-5xl">MU Social</h1>
        </div>
      </div>
    </div>
  );
}