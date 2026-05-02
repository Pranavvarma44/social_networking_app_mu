import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import {
  Camera,
  Edit2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react"

interface ProfilePageProps {
  onBack: () => void
  userId?: string
}

export default function ProfilePage({ onBack, userId }: ProfilePageProps) {

  const token = localStorage.getItem("token")

  // 🔐 CURRENT USER
  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId || payload.id
    }
  } catch {
    localStorage.removeItem("token")
  }

  const profileId = userId || currentUserId
  const isOwnProfile = profileId === currentUserId

  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [profilePic, setProfilePic] = useState<string | null>(null)

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ================= FETCH =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUser(res.data.user)
      setNameInput(res.data.user.name)
      setProfilePic(res.data.user.profilePic || null)

    } catch (err) {
      console.error("PROFILE ERROR:", err)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/posts/user/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPosts(res.data)

    } catch (err) {
      console.error("POST ERROR:", err)
    }
  }

  useEffect(() => {
    if (!profileId || !token) return
    fetchProfile()
    fetchPosts()
  }, [profileId])

  // ================= FOLLOW =================
  const handleFollow = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/users/${profileId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProfile()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnfollow = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/users/${profileId}/unfollow`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProfile()
    } catch (err) {
      console.error(err)
    }
  }

  // 🔥 FIXED FOLLOW CHECK
  const isFollowing = user?.followers?.some(
    (f: any) =>
      (typeof f === "string" ? f : f._id)?.toString() === currentUserId?.toString()
  )

  // ================= PROFILE PIC =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) setProfilePic(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  // ================= NAME =================
  const saveName = () => {
    setEditingName(false)
    // optional API
  }

  const cancelName = () => {
    setNameInput(user?.name || "")
    setEditingName(false)
  }

  if (!user) {
    return <div className="p-6 text-gray-400">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* PROFILE CARD */}
      <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl overflow-hidden mb-6">

        <div className="h-32 bg-gradient-to-r from-[#ff5757]/30" />

        <div className="px-6 pb-6">

          <div className="flex justify-between -mt-10 mb-4">

            {/* AVATAR */}
            <div className="relative">
              <div
                onClick={() => isOwnProfile && fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-[#ff5757] flex items-center justify-center text-white text-xl cursor-pointer overflow-hidden"
              >
                {profilePic ? (
                  <img src={profilePic} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]
                )}
              </div>

              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#ff5757] p-1 rounded-full"
                  >
                    <Camera className="w-3 h-3" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>

            {/* FOLLOW BUTTON */}
            {!isOwnProfile && (
              isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="px-4 py-2 bg-[#ff5757] rounded hover:bg-[#ff4545]"
                >
                  Follow
                </button>
              )
            )}
          </div>

          {/* NAME */}
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-[#1a1a1a] px-2 rounded"
              />
              <button onClick={saveName}><Check /></button>
              <button onClick={cancelName}><X /></button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <h2 className="text-xl font-semibold">{user.name}</h2>

              {isOwnProfile && (
                <button onClick={() => setEditingName(true)}>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          )}

          <p className="text-gray-500 text-sm">
            @{user.name?.toLowerCase().replace(/\s+/g, "")}
          </p>

          {/* STATS */}
          <div className="flex gap-6 mt-4 text-sm">
            <div><b>{posts.length}</b> Posts</div>
            <div><b>{user.followers?.length || 0}</b> Followers</div>
            <div><b>{user.following?.length || 0}</b> Following</div>
          </div>

        </div>
      </div>

      {/* POSTS */}
      <div>
        <h3 className="mb-4 font-semibold">Posts</h3>

        {posts.map((post) => (
          <div key={post._id} className="border border-gray-800 p-4 mb-3 rounded">
            <p>{post.content}</p>

            <div className="flex gap-4 mt-2 text-gray-400 text-sm">
              <span>❤️ {post.likesCount || 0}</span>
              <span>💬 {post.commentsCount || 0}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}