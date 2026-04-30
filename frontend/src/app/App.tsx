import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import Authpage from "./Pages/AuthPage"
import Home from "./Home/Home"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Page */}
        <Route
          path="/auth"
          element={
            !isAuthenticated ? (
              <Authpage
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Home (Protected) */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
