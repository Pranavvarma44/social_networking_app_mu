import { useState } from "react"
import axios from "axios"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const API = import.meta.env.VITE_API_URL

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /* -------- REGISTER -------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(
        `${API}/auth/register`,
        { name, email, password, role }
      )

      if (res.status === 200 || res.status === 201) {
        setShowOtp(true)
      }

    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  /* -------- VERIFY OTP -------- */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(
        `${API}/auth/verify-otp`,
        { email, otp }
      )

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token)
        window.location.href = "/dashboard"
      }

    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={showOtp ? handleVerifyOtp : handleRegister}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>

        {/* TITLE */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-white">
            {showOtp ? "Verify OTP" : "Sign Up"}
          </h1>
          {showOtp && (
            <p className="text-sm text-gray-400">
              OTP sent to {email}
            </p>
          )}
        </div>

        {/* REGISTER FIELDS */}
        {!showOtp && (
          <>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-white"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="alumni">Alumni</option>
              </select>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </>
        )}

        {/* OTP FIELD */}
        {showOtp && (
          <Field>
            <FieldLabel>Enter OTP</FieldLabel>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="tracking-widest text-center text-lg"
            />
          </Field>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff5757] to-[#ff3b3b] text-white 
                     hover:scale-[1.02] transition-all"
        >
          {loading
            ? "Please wait..."
            : showOtp
            ? "Verify OTP"
            : "Create Account"}
        </Button>

        {/* FOOTER */}
        {!showOtp && (
          <Field>
            <FieldDescription className="text-center text-gray-400">
              Already have an account?{" "}
              <a href="/" className="underline text-white">
                Log in
              </a>
            </FieldDescription>
          </Field>
        )}

      </FieldGroup>
    </form>
  )
}