import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import React, { useState, useEffect } from "react"

import Login from "./Pages/login"
import Home from "./Home/Home"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // ✅ persist login using token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsAuthenticated(true)
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* HOME (PROTECTED) */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="login" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App