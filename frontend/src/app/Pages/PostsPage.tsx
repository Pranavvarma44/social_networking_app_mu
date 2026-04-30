import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import axios from "axios"
import { Bookmark, Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function PostsPage({ composeSignal }: { composeSignal?: number }) {

  const [posts, setPosts] = useState<any[]>([])
  const [draft, setDraft] = useState("")
  const [highlightComposer, setHighlightComposer] = useState(false)

  const composerRef = useRef<HTMLTextAreaElement | null>(null)

  const token = localStorage.getItem("token")

  // =========================
  // FETCH FEED
  // =========================
  useEffect(() => {
    if (!token) return

    axios.get(`${API_URL}/api/posts/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPosts(res.data))
    .catch(console.error)

  }, [token])

  // =========================
  // COMPOSER FOCUS
  // =========================
  useLayoutEffect(() => {
    if (!composeSignal) return

    setDraft("")
    setHighlightComposer(true)

    setTimeout(() => setHighlightComposer(false), 900)

    requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      composerRef.current?.focus()
    })
  }, [composeSignal])

  // =========================
  // CREATE POST
  // =========================
  const submitPost = async () => {
    if (!draft.trim()) return

    try {
      const res = await axios.post(
        `${API_URL}/api/posts`,
        { content: draft },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setPosts(prev => [res.data, ...prev])
      setDraft("")

    } catch (err) {
      console.error(err)
    }
  }

  // =========================
  // LIKE
  // =========================
  const toggleLike = async (postId: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, likesCount: res.data.likesCount }
            : p
        )
      )

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>

      {/* =========================
          POST COMPOSER
      ========================= */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex gap-3">

          <div className="w-10 h-10 bg-[#ff5757] rounded-full flex items-center justify-center text-sm flex-shrink-0">
            U
          </div>

          <div className="flex-1">

            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="What's happening on campus?"
              className={`w-full bg-transparent text-gray-300 text-lg focus:outline-none mb-3 resize-none rounded-lg ${
                highlightComposer ? "ring-2 ring-[#ff5757]/70" : ""
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  submitPost()
                }
              }}
            />

            <div className="flex items-center justify-between gap-4">

              <div className="flex gap-4">
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525]">
                  📷 Photo
                </button>
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525]">
                  📊 Poll
                </button>
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525]">
                  📍 Event
                </button>
              </div>

              <button
                onClick={submitPost}
                disabled={!draft.trim()}
                className="bg-[#ff5757] text-white px-5 py-2 rounded-lg hover:bg-[#ff4545] disabled:opacity-50"
              >
                Post
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* =========================
          POSTS LIST
      ========================= */}
      <div>

        {posts.map((post) => (
          <div
            key={post._id}
            className="border-b border-gray-800 p-6 hover:bg-[#0d0d0d]"
          >
            <div className="flex gap-3">

              {/* Avatar */}
              <div className="text-3xl">
                {post.author?.name?.charAt(0) || "👤"}
              </div>

              <div className="flex-1">

                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">
                    {post.author?.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    · {new Date(post.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-3">{post.content}</p>

                {/* MEDIA */}
                {post.media?.length > 0 && (
                  <div className="mb-3">
                    {post.media[0].type === "image" ? (
                      <img
                        src={post.media[0].url}
                        className="rounded-xl max-h-96 w-full object-cover"
                      />
                    ) : (
                      <video
                        src={post.media[0].url}
                        controls
                        className="rounded-xl max-h-96 w-full"
                      />
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex items-center justify-between text-gray-500 max-w-md">

                  {/* LIKE */}
                  <button
                    onClick={() => toggleLike(post._id)}
                    className="flex items-center gap-2 hover:text-[#ff5757]"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likesCount || 0}</span>
                  </button>

                  {/* COMMENT */}
                  <button className="flex items-center gap-2 hover:text-blue-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount || 0}</span>
                  </button>

                  {/* SHARE */}
                  <button className="flex items-center gap-2 hover:text-green-500">
                    <Share2 className="w-4 h-4" />
                    <span>0</span>
                  </button>

                  {/* SAVE */}
                  <button className="hover:text-yellow-500">
                    <Bookmark className="w-4 h-4" />
                  </button>

                </div>
              </div>

              {/* MENU */}
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full">
                <MoreHorizontal className="w-4 h-4" />
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}