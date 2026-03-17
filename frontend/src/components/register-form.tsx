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

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {showOtp ? "Verify OTP" : "Sign Up"}
          </h1>
        </div>

        {!showOtp && (
          <>
            {/* NAME */}
            <Field>
              <FieldLabel htmlFor="name">Username</FieldLabel>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            {/* EMAIL */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            {/* ROLE DROPDOWN */}
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="alumini">Alumini</option>
              </select>
            </Field>

            {/* PASSWORD */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </>
        )}

        {showOtp && (
          <Field>
            <FieldLabel htmlFor="otp">Enter OTP</FieldLabel>
            <Input
              id="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Field>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : showOtp
              ? "Verify OTP"
              : "Register"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a href="/" className="underline underline-offset-4">
              Log in
            </a>
          </FieldDescription>
        </Field>

      </FieldGroup>
    </form>
  )
}