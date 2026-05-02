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

  const openProfile = (userId: string) => {
    setProfileUserId(userId)
    setShowProfile(true)
  }

  const handleProfileClick = () => {
    setProfileUserId(null)
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

    switch (activeTab) {
      case "messages":
        return <MessagesPage />
      case "events":
        return <EventsPage />
      case "study":
        return <StudyGroupsPage />
      case "opportunities":
        return <OpportunitiesPage />
      default:
        return <PostsPage onUserClick={openProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* 🔝 TOP NAV */}
      <div className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* LOGO + SEARCH */}
          <div className="flex items-center gap-8">
            <h1 className="text-xl flex items-center gap-2">
              <span className="text-[#ff5757]">MU</span> SOCIAL.
            </h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search MU Social..."
                className="bg-[#1a1a1a] border border-gray-800 rounded-full pl-10 pr-4 py-2 w-80 text-sm focus:outline-none focus:border-[#ff5757]"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full transition-colors ${
                  showNotifications
                    ? "bg-[#ff5757]/20"
                    : "hover:bg-[#1a1a1a]"
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>

              {showNotifications && (
                <NotificationsPanel
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* 👤 PROFILE */}
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-[#ff5757] rounded-full flex items-center justify-center text-sm hover:ring-2 hover:ring-[#ff5757]/60"
            >
              JD
            </button>

            {/* 🚪 LOGOUT */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 hover:bg-[#1a1a1a] rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto flex">

        {/* 📌 LEFT SIDEBAR */}
        <div className="w-64 border-r border-gray-800 min-h-screen sticky top-16 p-6">
          <nav className="space-y-2">

            <NavItem
              icon={HomeIcon}
              label="Home"
              active={activeTab === "home" && !showProfile}
              onClick={() => {
                setActiveTab("home")
                setShowProfile(false)
              }}
            />

            <NavItem
              icon={MessageCircle}
              label="Messages"
              active={activeTab === "messages" && !showProfile}
              onClick={() => {
                setActiveTab("messages")
                setShowProfile(false)
              }}
            />

            <NavItem
              icon={Users}
              label="Study Groups"
              active={activeTab === "study" && !showProfile}
              onClick={() => {
                setActiveTab("study")
                setShowProfile(false)
              }}
            />

            <NavItem
              icon={Calendar}
              label="Events"
              active={activeTab === "events" && !showProfile}
              onClick={() => {
                setActiveTab("events")
                setShowProfile(false)
              }}
            />

            <NavItem
              icon={Briefcase}
              label="Opportunities"
              active={activeTab === "opportunities" && !showProfile}
              onClick={() => {
                setActiveTab("opportunities")
                setShowProfile(false)
              }}
            />

            {/* PROFILE TAB */}
            <NavItem
              icon={Users}
              label="Profile"
              active={showProfile}
              onClick={handleProfileClick}
            />
          </nav>
        </div>

        {/* 🧠 MAIN CONTENT */}
        <div className="flex-1 border-r border-gray-800">
          {renderMain()}
        </div>

        {/* 👉 RIGHT SIDEBAR */}
        {!showProfile && <RightSidebar />}
      </div>
    </div>
  )
}

/* NAV ITEM */
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition ${
        active
          ? "bg-[#ff5757] text-white"
          : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )
}