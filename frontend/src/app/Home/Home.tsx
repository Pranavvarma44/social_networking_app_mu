import React, { useState } from "react"
import {
  Bell,
  Briefcase,
  Calendar,
  Home as HomeIcon,
  LogOut,
  MessageCircle,
  Search,
  Users,
} from "lucide-react"

import EventsPage from "../Pages/EventsPage"
import MessagesPage from "../Pages/MessagesPage"
import OpportunitiesPage from "../Pages/OpportunitiesPage"
import PostsPage from "../Pages/PostsPage"
import ProfilePage from "../Pages/ProfilePage"
import StudyGroupsPage from "../Pages/StudyGroupsPage"

import NotificationsPanel from "../components/NotificationsPanel"
import RightSidebar from "../components/RightSidebar"

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void
}

export default function Home({ setIsAuthenticated }: HomeProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [showProfile, setShowProfile] = useState(false)
  const [profileUserId, setProfileUserId] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  // 🔥 OPEN ANY USER PROFILE
  const openProfile = (userId: string) => {
    setProfileUserId(userId)
    setShowProfile(true)
  }

  // 🔥 OPEN OWN PROFILE
  const handleProfileClick = () => {
    setProfileUserId(null) // null = own profile
    setShowProfile(true)
    setShowNotifications(false)
  }

  const handleBackFromProfile = () => {
    setShowProfile(false)
  }

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  const renderMain = () => {
    if (showProfile) {
      return (
        <ProfilePage
          onBack={handleBackFromProfile}
          userId={profileUserId || undefined}
        />
      )
    }

    const pages: any = {
      home: <PostsPage onUserClick={openProfile} />,
      messages: <MessagesPage />,
      events: <EventsPage />,
      study: <StudyGroupsPage />,
      opportunities: <OpportunitiesPage />,
    }

    return pages[activeTab] || <PostsPage onUserClick={openProfile} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* TOP BAR */}
      <div className="border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">

          <div className="flex items-center gap-6">
            <h1 className="text-xl">
              <span className="text-[#ff5757]">MU</span> SOCIAL.
            </h1>

            <div className="relative">
              <Search className="absolute left-3 top-2 text-gray-500 w-4 h-4" />
              <input className="pl-10 bg-[#1a1a1a] rounded px-3 py-1" />
            </div>
          </div>

          <div className="flex gap-3">

            <button onClick={toggleNotifications}>
              <Bell />
            </button>

            <button onClick={handleProfileClick} className="bg-red-500 w-8 h-8 rounded-full">
              JD
            </button>

            <button onClick={() => setIsAuthenticated(false)}>
              <LogOut />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">

        {/* SIDEBAR */}
        <div className="w-64 p-4">
          <NavItem label="Home" onClick={() => setActiveTab("home")} />
          <NavItem label="Messages" onClick={() => setActiveTab("messages")} />
          <NavItem label="Events" onClick={() => setActiveTab("events")} />
          <NavItem label="Study" onClick={() => setActiveTab("study")} />
          <NavItem label="Opportunities" onClick={() => setActiveTab("opportunities")} />
        </div>

        {/* MAIN */}
        <div className="flex-1">
          {renderMain()}
        </div>

        {!showProfile && <RightSidebar />}
      </div>
    </div>
  )
}

function NavItem({ label, onClick }: any) {
  return (
    <button onClick={onClick} className="block py-2">
      {label}
    </button>
  )
}