import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import {
  Camera,
  Edit2,
  Check,
  X,
  UserPlus,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Grid,
  ArrowLeft,
} from "lucide-react"

interface ProfilePageProps {
  onBack: () => void
  userId?: string
}

export default function ProfilePage({ onBack, userId }: ProfilePageProps) {
  const token = localStorage.getItem("token")

  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload.userId ?? payload.id ?? payload._id
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

  // ================= FETCH DATA =================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data.user)
      setNameInput(res.data.user.name)
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
    if (!token || !profileId) return
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

  const isFollowing = user?.followers?.some(
    (f: any) => f === currentUserId || f._id === currentUserId
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
    // OPTIONAL: send update API here
  }

  const cancelName = () => {
    setNameInput(user?.name || "")
    setEditingName(false)
  }

  if (!user) return <div className="p-6 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* BACK */}
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
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
                className="w-20 h-20 rounded-full bg-[#ff5757] flex items-center justify-center text-white text-xl cursor-pointer"
              >
                {profilePic ? (
                  <img src={profilePic} className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.name?.[0]
                )}
              </div>

              {isOwnProfile && (
                <>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#ff5757] p-1 rounded-full">
                    <Camera className="w-3 h-3" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>

            {/* FOLLOW BUTTON */}
            {!isOwnProfile && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className="px-4 py-2 bg-[#ff5757] rounded text-sm"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* NAME */}
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-[#1a1a1a] px-2"
              />
              <button onClick={saveName}><Check /></button>
              <button onClick={cancelName}><X /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <h2 className="text-xl">{user.name}</h2>
              {isOwnProfile && (
                <button onClick={() => setEditingName(true)}>
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <p className="text-gray-500">@{user.name?.toLowerCase()}</p>

          {/* STATS */}
          <div className="flex gap-6 mt-4">
            <div>{posts.length} Posts</div>
            <div>{user.followers?.length || 0} Followers</div>
            <div>{user.following?.length || 0} Following</div>
          </div>
        </div>
      </div>

      {/* POSTS */}
      <div>
        <h3 className="mb-4">Posts</h3>

        {posts.map((post) => (
          <div key={post._id} className="border p-4 mb-3 rounded">
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