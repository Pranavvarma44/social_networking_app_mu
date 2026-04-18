import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./login/page"   // adjust if filename different
import Dashboard from "./dashboard/Dashboard"
import RegisterPage from "./register/RegisterPage.tsx"
import ChatPage from "./chat/ChatPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App