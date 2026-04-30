import { useState } from "react"
import axios from "axios"

export default function RegisterPage() {
  const API = import.meta.env.VITE_API_URL

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${API}/auth/register`, {
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
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* LEFT SIDE */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-white text-sm mb-1 flex items-center gap-2">
              <span className="text-2xl">📱</span> MU SOCIAL.
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-white text-4xl mb-3">
              {showOtp ? "Verify OTP" : "Create your account"}
            </h2>
            <p className="text-gray-400">
              {showOtp
                ? `OTP sent to ${email}`
                : "Enter your details to register"}
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={showOtp ? handleVerifyOtp : handleRegister}
            className="space-y-6"
          >

            {!showOtp && (
              <>
                {/* NAME */}
                <div>
                  <label className="text-white block mb-2">Username</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-white block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label className="text-white block mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-white block mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </>
            )}

            {/* OTP FIELD */}
            {showOtp && (
              <div>
                <label className="text-white block mb-2">OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white text-center tracking-widest"
                />
              </div>
            )}

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold 
                        bg-gradient-to-r from-[#ff5757] to-[#ff3b3b] 
                        text-white 
                        shadow-lg shadow-red-500/20
                        hover:shadow-red-500/40 hover:scale-[1.02]
                        transition-all duration-200 
                        disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : showOtp
                ? "Verify OTP"
                : "Register"}
            </button>

            {/* FOOTER */}
            {!showOtp && (
              <p className="text-center text-gray-400">
                Already have an account?{" "}
                <a href="/" className="text-white underline">
                  Login
                </a>
              </p>
            )}

          </form>
        </div>
      </div>

      {/* RIGHT SIDE (UNCHANGED) */}
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