import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./login/page"   // adjust if filename different
import Dashboard from "./dashboard/Dashboard"
import RegisterPage from "./register/RegisterPage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App