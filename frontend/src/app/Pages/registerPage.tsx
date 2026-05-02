import React, { useState } from "react"
import axios from "axios"

type Props = {
  setIsAuthenticated: (val: boolean) => void
}

export default function RegisterPage({ setIsAuthenticated }: Props) {
  const API = import.meta.env.VITE_API_URL

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")

  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${API}api/auth/register`, {
        name,
        email,
        password,
        role,
      })

      if (res.status === 200 || res.status === 201) {
        setShowOtp(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // VERIFY OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        email,
        otp,
      })

      localStorage.setItem("token", res.data.token)
      setIsAuthenticated(true)
      window.location.href = "/"
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* LEFT */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-12">
            <h1 className="text-white text-sm flex items-center gap-2">
              <span className="text-2xl">📱</span> MU SOCIAL.
            </h1>
          </div>

          {/* TITLE */}
          <div className="mb-8">
            <h2 className="text-white text-4xl mb-2">
              {showOtp ? "Verify OTP" : "Create account"}
            </h2>
            <p className="text-gray-400">
              {showOtp ? "Enter OTP sent to your email" : "Join MU Social"}
            </p>
          </div>

          <form
            onSubmit={showOtp ? handleVerifyOtp : handleRegister}
            className="space-y-6"
          >
            {!showOtp && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="alumni">Alumni</option>
                </select>

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </>
            )}

            {showOtp && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold 
                bg-gradient-to-r from-[#ff5757] to-[#ff3b3b] 
                text-white hover:scale-[1.02] transition-all"
            >
              {loading
                ? "Please wait..."
                : showOtp
                ? "Verify OTP"
                : "Register"}
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{" "}
              <a href="/auth" className="text-white underline">
                Login
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
  )
}