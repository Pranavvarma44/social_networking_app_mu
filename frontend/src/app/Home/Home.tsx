import React, { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
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

  const [search, setSearch] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  // ================= PROFILE =================
  const openProfile = (userId: string) => {
    setProfileUserId(userId)
    setShowProfile(true)
    setShowResults(false)
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

  // ================= SEARCH =================
  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/users?search=${search}`
        )
        setResults(res.data.users)
        setShowResults(true)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  const [userName, setUserName] = useState("")

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token) return

    try {

      const payload = JSON.parse(atob(token.split(".")[1]))

      setUserName(payload.name || "")

    } catch {

      console.error("Invalid token")

    }

  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false)
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "U"
  
    const parts = name.trim().split(" ")
  
    if (parts.length === 1) {
      return parts[0][0].toUpperCase()
    }
  
    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase()
  }

  // ================= MAIN =================
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
      messages: <MessagesPage onUserClick={openProfile} />,
      events: <EventsPage />,
      study: <StudyGroupsPage />,
      opportunities: <OpportunitiesPage />,
    }

    return pages[activeTab] || <PostsPage onUserClick={openProfile} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ================= TOP NAV ================= */}
      <div className="border-b border-gray-800 sticky top-0 z-50 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">

          <div className="flex items-center gap-6">
            <h1 className="text-xl">
              <span className="text-[#ff5757]">MU</span> SOCIAL.
            </h1>

            {/* SEARCH */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Search className="absolute left-3 top-2 text-gray-500 w-4 h-4" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 bg-[#1a1a1a] rounded px-3 py-2 w-80"
              />

              {/* DROPDOWN */}
              {showResults && results.length > 0 && (
                <div className="absolute top-12 w-80 bg-[#111] border border-gray-800 rounded-lg z-50">

                  {results.map((user) => (
                    <SearchUserItem
                      key={user._id}
                      user={user}
                      openProfile={openProfile}
                    />
                  ))}

                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">

            <button onClick={toggleNotifications}>
              <Bell />
            </button>

            <button

              onClick={handleProfileClick}

              className="bg-red-500 w-8 h-8 rounded-full"

            >

              JD

            </button>

            <button onClick={() => setIsAuthenticated(false)}>
              <LogOut />
            </button>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex max-w-7xl mx-auto">

        {/* SIDEBAR */}
        <div className="w-64 p-4 border-r border-gray-800">
          <NavItem label="Home" onClick={() => setActiveTab("home")} />
          <NavItem label="Messages" onClick={() => setActiveTab("messages")} />
          <NavItem label="Events" onClick={() => setActiveTab("events")} />
          <NavItem label="Study" onClick={() => setActiveTab("study")} />
          <NavItem label="Opportunities" onClick={() => setActiveTab("opportunities")} />
        </div>

        {/* MAIN */}
        <div className="flex-1 border-r border-gray-800">
          {renderMain()}
        </div>

        {!showProfile && <RightSidebar />}
      </div>
    </div>
  )
}

/* ================= NAV ITEM ================= */
function NavItem({ label, onClick }: any) {
  return (
    <button onClick={onClick} className="block py-2 hover:text-white text-gray-400">
      {label}
    </button>
  )
}

/* ================= SEARCH ITEM ================= */
function SearchUserItem({ user, openProfile }: any) {
  const token = localStorage.getItem("token")

  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId
    }
  } catch {}

  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (user.followers) {
      const found = user.followers.some(
        (f: any) => (f._id || f).toString() === currentUserId
      )
      setIsFollowing(found)
    }
  }, [user])

  const handleFollow = async (e: any) => {
    e.stopPropagation()

    await axios.post(
      `${BASE_URL}/api/users/${user._id}/follow`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setIsFollowing(true)
  }

  const handleUnfollow = async (e: any) => {
    e.stopPropagation()

    await axios.delete(
      `${BASE_URL}/api/users/${user._id}/unfollow`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setIsFollowing(false)
  }

  return (
    <div
      onClick={() => openProfile(user._id)}
      className="flex justify-between p-3 hover:bg-[#1a1a1a] cursor-pointer"
    >
      <div>
        <div>{user.name}</div>
        <div className="text-xs text-gray-400">{user.email}</div>
      </div>

      {currentUserId !== user._id && (
        isFollowing ? (
          <button onClick={handleUnfollow} className="text-xs bg-gray-600 px-2 rounded">
            Unfollow
          </button>
        ) : (
          <button onClick={handleFollow} className="text-xs bg-red-500 px-2 rounded">
            Follow
          </button>
        )
      )}
    </div>
  )
}