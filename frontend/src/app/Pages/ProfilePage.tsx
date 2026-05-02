import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import {
  Camera,
  Edit2,
  Check,
  X,
  ArrowLeft,
  MessageSquare,
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
      currentUserId = payload._id || payload.userId || payload.id
    }
  } catch {}

  const profileId = userId || currentUserId
  const isOwnProfile = profileId === currentUserId

  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [profilePic, setProfilePic] = useState<string | null>(null)

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")

  // 🔥 COMMENTS STATE
  const [openComments, setOpenComments] = useState<string | null>(null)
  const [comments, setComments] = useState<{ [key: string]: any[] }>({})
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ================= FETCH =================
  const fetchProfile = async () => {
    const res = await axios.get(`${BASE_URL}/api/users/${profileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setUser(res.data.user)
    setNameInput(res.data.user.name)
    setProfilePic(res.data.user.profilePic || null)
  }

  const fetchPosts = async () => {
    const res = await axios.get(`${BASE_URL}/api/posts/user/${profileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setPosts(res.data)
  }

  useEffect(() => {
    if (!profileId || !token) return
    fetchProfile()
    fetchPosts()
  }, [profileId])

  // ================= FOLLOW =================
  const handleFollow = async () => {
    await axios.post(
      `${BASE_URL}/api/users/${profileId}/follow`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchProfile()
  }

  const handleUnfollow = async () => {
    await axios.delete(
      `${BASE_URL}/api/users/${profileId}/unfollow`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchProfile()
  }

  const isFollowing = user?.followers?.some(
    (f: any) =>
      (typeof f === "string" ? f : f._id)?.toString() === currentUserId?.toString()
  )

  // ================= COMMENTS =================
  const fetchComments = async (postId: string) => {
    const res = await axios.get(
      `${BASE_URL}/api/posts/${postId}/comments`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setComments((prev) => ({
      ...prev,
      [postId]: res.data,
    }))
  }

  const submitComment = async (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim()) return

    const res = await axios.post(
      `${BASE_URL}/api/posts/${postId}/comments`,
      { content: text },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), res.data],
    }))

    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  if (!user) return <div className="p-6 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* BACK */}
      <button onClick={onBack} className="flex gap-2 text-gray-400 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      {/* PROFILE */}
      <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl mb-6">

        <div className="h-32 bg-[#ff5757]/20" />

        <div className="p-6">

          <div className="flex justify-between -mt-10">

            <div className="relative">
              <div
                onClick={() => isOwnProfile && fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-[#ff5757] flex items-center justify-center text-white text-xl overflow-hidden"
              >
                {profilePic ? (
                  <img src={profilePic} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]
                )}
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className="px-4 py-2 bg-[#ff5757] rounded"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <h2 className="text-xl mt-3">{user.name}</h2>
          <p className="text-gray-500 text-sm">@{user.name}</p>

          <div className="flex gap-6 mt-3 text-sm">
            <div>{posts.length} Posts</div>
            <div>{user.followers?.length || 0} Followers</div>
            <div>{user.following?.length || 0} Following</div>
          </div>
        </div>
      </div>

      {/* POSTS */}
      {posts.map((post) => (
        <div key={post._id} className="border border-gray-800 p-4 mb-4 rounded">

          <p>{post.content}</p>

          {/* MEDIA */}
          {post.media?.length > 0 && (
            <div className="mt-2">
              {post.media[0].type === "image" ? (
                <img src={post.media[0].url} className="rounded max-h-96" />
              ) : (
                <video src={post.media[0].url} controls className="rounded max-h-96" />
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 mt-3 text-sm text-gray-400">

            <span>❤️ {post.likesCount || 0}</span>

            <button
              onClick={() => {
                if (openComments === post._id) {
                  setOpenComments(null)
                } else {
                  setOpenComments(post._id)
                  if (!comments[post._id]) fetchComments(post._id)
                }
              }}
              className="flex items-center gap-1"
            >
              <MessageSquare size={14} />
              {post.commentsCount || 0}
            </button>

          </div>

          {/* COMMENTS */}
          {openComments === post._id && (
            <div className="mt-3 bg-[#111] p-3 rounded space-y-2">

              {(comments[post._id] || []).map((c) => (
                <div key={c._id} className="text-sm">
                  <span className="font-medium text-white">
                    {c.author?.name}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {c.content}
                  </span>
                </div>
              ))}

              {/* INPUT BELOW */}
              <div className="flex gap-2 border-t border-gray-800 pt-2">
                <input
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 bg-[#1a1a1a] px-3 py-1 rounded text-sm"
                />

                <button
                  onClick={() => submitComment(post._id)}
                  className="bg-[#ff5757] px-3 rounded text-sm"
                >
                  Send
                </button>
              </div>

            </div>
          )}

        </div>
      ))}
    </div>
  )
}