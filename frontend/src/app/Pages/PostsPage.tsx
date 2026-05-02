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
  const [openComments, setOpenComments] = useState<string | null>(null)

  const [comments, setComments] = useState<{ [key: string]: any[] }>({})

  const [commentText, setCommentText] = useState("")

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

  const fetchComments=async(postId:string)=>{
    try{
      const res=await axios.get(`${API_URL}/api/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments((prev)=>({
        ...prev,
        [postId]:res.data
      }))

    }catch(err){
      console.error(err)
    }
  }

  const submitComment = async (postId: string) => {
    if (!commentText.trim()) return
  
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
  
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }))
  
      setCommentText("")
    } catch (err) {
      console.error(err)
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

        {/* AVATAR */}

        <div

          onClick={() => onUserClick?.(post.author?._id)}

          className="text-3xl cursor-pointer hover:scale-110 transition"

        >

          👤

        </div>

        <div className="flex-1">

          {/* NAME */}

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

          {/* CONTENT */}

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

            {/* LIKE */}

            <button

              onClick={() => toggleLike(post._id)}

              className={`flex gap-2 ${post.isLiked ? "text-red-500" : ""}`}

            >

              <Heart size={16} />

              {post.likesCount || 0}

            </button>

            {/* COMMENTS */}

            <button

              onClick={() => {

                if (openComments === post._id) {

                  setOpenComments(null)

                } else {

                  setOpenComments(post._id)

                  if (!comments[post._id]) {

                    fetchComments(post._id)

                  }

                }

              }}

              className="flex items-center gap-2"

            >

              <MessageSquare size={16} />

              {post.commentsCount || 0}

            </button>

            <button className="flex gap-2">

              <Share2 size={16} />

            </button>

            <Bookmark size={16} />

          </div>

          {/* ================= COMMENTS SECTION ================= */}

          {openComments === post._id && (

        <div className="mt-4 bg-[#111] p-3 rounded-lg space-y-3">

          {/* 🧾 COMMENTS LIST FIRST */}

          {(comments[post._id] || []).length === 0 ? (

            <p className="text-gray-500 text-sm">No comments yet</p>

          ) : (

            (comments[post._id] || []).map((c) => (

              <div key={c._id} className="text-sm">

                <span className="font-medium text-white">

                  {c.author?.name}

                </span>

                <span className="text-gray-400 ml-2">

                  {c.content}

                </span>

              </div>

            ))

          )}

          {/* ✏️ INPUT BELOW */}

          <div className="flex gap-2 pt-2 border-t border-gray-800">

            <input

              value={commentText}

              onChange={(e) => setCommentText(e.target.value)}

              placeholder="Write a comment..."

              className="flex-1 bg-[#1a1a1a] px-3 py-2 rounded text-sm outline-none"

            />

            <button

              onClick={() => submitComment(post._id)}

              className="bg-[#ff5757] px-4 py-2 rounded text-sm hover:bg-[#ff4545]"

            >

              Send

            </button>

          </div>

        </div>

        )}

        </div>

        <MoreHorizontal size={16} />

      </div>

    </div>

  ))}

</div>
    </div>
  )
}