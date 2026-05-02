import React, { useLayoutEffect, useRef, useState } from "react"
import axios from "axios"
import { Bookmark, Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function PostsPage({
  composeSignal,
  onUserClick, // 🔥 NEW
}: {
  composeSignal?: number
  onUserClick?: (userId: string) => void // 🔥 NEW
}) {

  const [posts, setPosts] = useState<any[]>([])
  const [draft, setDraft] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const token = localStorage.getItem("token")

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPosts(res.data)
    } catch (err) {
      console.error("FETCH POSTS ERROR:", err)
    }
  }

  useLayoutEffect(() => {
    fetchPosts()
  }, [])

  // ================= CREATE POST =================
  const submitPost = async () => {
    if (!draft.trim() && !file) return

    try {
      const formData = new FormData()
      formData.append("content", draft)
      if (file) formData.append("media", file)

      const res = await axios.post(
        `${API_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      setPosts((prev) => [res.data, ...prev])
      setDraft("")
      setFile(null)

    } catch (err) {
      console.error("POST ERROR:", err)
    }
  }

  // ================= LIKE =================
  const toggleLike = async (postId: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likesCount: res.data.likesCount,
                isLiked: res.data.liked,
              }
            : p
        )
      )
    } catch (err) {
      console.error("LIKE ERROR:", err)
    }
  }

  return (
    <div>

      {/* ================= COMPOSER ================= */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex gap-3">

          <div className="w-10 h-10 bg-[#ff5757] rounded-full flex items-center justify-center text-sm">
            U
          </div>

          <div className="flex-1">

            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="What's happening on campus?"
              className="w-full bg-transparent text-gray-400 text-lg focus:outline-none mb-3 resize-none"
            />

            {/* PREVIEW */}
            {file && (
              <div className="mb-3">
                {file.type.startsWith("image") ? (
                  <img src={URL.createObjectURL(file)} className="rounded-xl max-h-64" />
                ) : (
                  <video src={URL.createObjectURL(file)} controls className="rounded-xl max-h-64" />
                )}
              </div>
            )}

            <div className="flex justify-between">

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm"
              >
                📷 Photo
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0])
                  }
                }}
              />

              <button
                onClick={submitPost}
                className="bg-[#ff5757] px-5 py-2 rounded-lg"
              >
                Post
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ================= POSTS ================= */}
      <div>
        {posts.map((post) => (

          <div key={post._id} className="border-b border-gray-800 p-6">

            <div className="flex gap-3">

              {/* 🔥 AVATAR CLICK */}
              <div
                onClick={() => onUserClick?.(post.author?._id)}
                className="text-3xl cursor-pointer hover:scale-110 transition"
              >
                👤
              </div>

              <div className="flex-1">

                {/* 🔥 NAME CLICK */}
                <div className="flex gap-2 text-sm text-gray-400">

                  <span
                    onClick={() => onUserClick?.(post.author?._id)}
                    className="text-white font-medium cursor-pointer hover:underline"
                  >
                    {post.author?.name}
                  </span>

                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleTimeString()}</span>

                </div>

                <p className="text-gray-300 mt-2">{post.content}</p>

                {/* MEDIA */}
                {post.media?.length > 0 && (
                  <div className="mt-3">
                    {post.media[0].type === "image" ? (
                      <img src={post.media[0].url} className="rounded-xl max-h-96" />
                    ) : (
                      <video src={post.media[0].url} controls className="rounded-xl max-h-96" />
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-6 mt-4 text-gray-400">

                  <button
                    onClick={() => toggleLike(post._id)}
                    className={`flex gap-2 ${post.isLiked ? "text-red-500" : ""}`}
                  >
                    <Heart size={16} />
                    {post.likesCount || 0}
                  </button>

                  <button className="flex gap-2">
                    <MessageSquare size={16} />
                    {post.commentsCount || 0}
                  </button>

                  <button className="flex gap-2">
                    <Share2 size={16} />
                  </button>

                  <Bookmark size={16} />

                </div>
              </div>

              <MoreHorizontal size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}