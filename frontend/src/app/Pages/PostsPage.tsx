import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"

interface Props {
  onBack: () => void
  userId?: string
}

export default function ProfilePage({ onBack, userId }: Props) {

  const token = localStorage.getItem("token")

  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId
    }
  } catch {}

  const profileId = userId || currentUserId
  const isOwnProfile = profileId === currentUserId

  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${BASE_URL}/api/users/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const postsRes = await axios.get(`${BASE_URL}/api/posts/user/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUser(userRes.data.user)
      setPosts(postsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!profileId) return
    fetchData()
  }, [profileId])

  // ================= FOLLOW =================
  const handleFollow = async () => {
    await axios.post(`${BASE_URL}/api/users/${profileId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchData()
  }

  const handleUnfollow = async () => {
    await axios.delete(`${BASE_URL}/api/users/${profileId}/unfollow`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchData()
  }

  const isFollowing = user?.followers?.some(
    (f: any) => (typeof f === "string" ? f : f._id) === currentUserId
  )

  if (!user) return <div>Loading...</div>

  return (
    <div className="p-6">

      <button onClick={onBack}>⬅ Back</button>

      <h2 className="text-xl">{user.name}</h2>
      <p>@{user.name?.toLowerCase()}</p>

      <div className="flex gap-4 mt-2">
        <span>{posts.length} Posts</span>
        <span>{user.followers?.length || 0} Followers</span>
        <span>{user.following?.length || 0} Following</span>
      </div>

      {/* FOLLOW BUTTON */}
      {!isOwnProfile && (
        <button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className="bg-red-500 px-3 py-1 mt-2 rounded"
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}

      {/* POSTS */}
      <div className="mt-6">
        {posts.map((post) => (
          <div key={post._id} className="border p-3 mb-2">
            <p>{post.content}</p>
          </div>
        ))}
      </div>

    </div>
  )
}