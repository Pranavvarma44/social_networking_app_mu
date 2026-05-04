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
import GroupPage from "../Pages/GroupPage"

import NotificationsPanel from "../components/NotificationsPanel"
import RightSidebar from "../components/RightSidebar"

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void
}

export default function Home({ setIsAuthenticated }: HomeProps) {

  const [activeTab, setActiveTab] = useState("home")

  const [showProfile, setShowProfile] = useState(false)
  const [profileUserId, setProfileUserId] = useState<string | null>(null)

  const [showGroup, setShowGroup] = useState(false)
  const [groupId, setGroupId] = useState<string | null>(null)

  const [showNotifications, setShowNotifications] = useState(false)

  const [search, setSearch] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)

  const [userName, setUserName] = useState("")

  // ================= PROFILE =================
  const openProfile = (userId: string) => {
    setProfileUserId(userId)
    setShowProfile(true)
    setShowGroup(false)
    setShowResults(false)
  }

  // ================= GROUP =================
  const openGroup = (id: string) => {
    setGroupId(id)
    setShowGroup(true)
    setShowProfile(false)
  }

  const handleBackFromProfile = () => setShowProfile(false)

  const handleBackFromGroup = () => {
    setShowGroup(false)
    setGroupId(null)
  }

  const handleProfileClick = () => {
    setProfileUserId(null)
    setShowProfile(true)
    setShowGroup(false)
    setShowNotifications(false)
  }

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  // ================= USER =================
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUserName(payload.name || "")
    } catch {}
  }, [])

  // ================= SEARCH =================
  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users?search=${search}`)
        setResults(res.data.users)
        setShowResults(true)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  useEffect(() => {
    const close = () => setShowResults(false)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // ================= MAIN =================
  const renderMain = () => {

    if (showGroup && groupId) {
      return (
        <GroupPage
          groupId={groupId}
          onBack={handleBackFromGroup}
        />
      )
    }

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
      study: <StudyGroupsPage onGroupClick={openGroup} />,
      opportunities: <OpportunitiesPage />,
    }

    return pages[activeTab]
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* TOP NAV */}
      <div className="border-b border-gray-800 sticky top-0 z-50 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl">
              <span className="text-[#ff5757]">MU</span> SOCIAL.
            </h1>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Search className="absolute left-3 top-2 w-4 h-4 text-gray-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 bg-[#1a1a1a] px-3 py-2 rounded w-80"
              />

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

          {/* RIGHT */}
          <div className="flex gap-3 items-center">

            <button onClick={toggleNotifications}>
              <Bell />
            </button>

            <button
              onClick={handleProfileClick}
              className="bg-[#ff5757] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            >
              {getInitials(userName)}
            </button>

            <button

              onClick={() => {

                localStorage.removeItem("token") // 🔥 remove token

                setIsAuthenticated(false)

              }}

            >

              <LogOut />

            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto flex">

        {/* SIDEBAR */}
        <div className="w-64 border-r border-gray-800 min-h-screen sticky top-16 p-6">
          <nav className="space-y-2">

            <NavItem icon={HomeIcon} label="Home" active={activeTab === "home"} onClick={() => { setActiveTab("home"); setShowProfile(false); setShowGroup(false) }} />

            <NavItem icon={MessageCircle} label="Messages" active={activeTab === "messages"} onClick={() => { setActiveTab("messages"); setShowProfile(false); setShowGroup(false) }} />

            <NavItem icon={Users} label="Study Groups" active={activeTab === "study"} onClick={() => { setActiveTab("study"); setShowProfile(false); setShowGroup(false) }} />

            <NavItem icon={Calendar} label="Events" active={activeTab === "events"} onClick={() => { setActiveTab("events"); setShowProfile(false); setShowGroup(false) }} />

            <NavItem icon={Briefcase} label="Opportunities" active={activeTab === "opportunities"} onClick={() => { setActiveTab("opportunities"); setShowProfile(false); setShowGroup(false) }} />

            <NavItem icon={Users} label="Profile" active={showProfile} onClick={handleProfileClick} />

          </nav>
        </div>

        {/* MAIN */}
        <div className="flex-1 border-r border-gray-800">
          {renderMain()}
        </div>

        {/* RIGHT SIDEBAR */}
        {!showProfile && !showGroup && <RightSidebar />}
      </div>
    </div>
  )
}

/* NAV ITEM */
function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg ${
        active
          ? "bg-[#ff5757] text-white"
          : "text-gray-400 hover:bg-[#1a1a1a]"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

/* ================= SEARCH USER ITEM ================= */
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
          <button onClick={handleFollow} className="text-xs bg-[#ff5757] px-2 rounded">
            Follow
          </button>
        )
      )}
    </div>
  )
}