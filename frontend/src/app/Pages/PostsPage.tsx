import React, { useLayoutEffect, useMemo, useRef, useState } from "react"
import { Bookmark, Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react"

export type Post = {
  id: number
  author: string
  handle: string
  avatar: string
  time: string
  content: string
  likes: number
  comments: number
  shares: number
  hasImage?: boolean
  imageType?: string
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Sarah Jenkins",
    handle: "@sarahj",
    avatar: "👩‍🎓",
    time: "2h",
    content:
      "Just finished my CS project! The team collaboration was amazing. Can't wait for the showcase next week! 🎉",
    likes: 124,
    comments: 18,
    shares: 5,
    hasImage: true,
    imageType: "campus",
  },
  {
    id: 2,
    author: "Jordan Smith",
    handle: "@jordans",
    avatar: "👨‍💼",
    time: "4h",
    content: "Anyone else excited for the basketball game tonight? Let's go MU! 🏀",
    likes: 89,
    comments: 12,
    shares: 3,
  },
  {
    id: 3,
    author: "Emily Wang",
    handle: "@emilyw",
    avatar: "👩‍🔬",
    time: "6h",
    content: "Study group meet at the library at 6pm. We're tackling the physics final review. All are welcome!",
    likes: 45,
    comments: 7,
    shares: 8,
  },
]

export default function PostsPage({ composeSignal }: { composeSignal?: number }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [draft, setDraft] = useState("")
  const [highlightComposer, setHighlightComposer] = useState(false)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)

  const nextId = useMemo(() => {
    const maxId = posts.reduce((m, p) => Math.max(m, p.id), 0)
    return maxId + 1
  }, [posts])

  useLayoutEffect(() => {
    if (!composeSignal) return
    setDraft("")
    setHighlightComposer(true)
    window.setTimeout(() => setHighlightComposer(false), 900)

    requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      composerRef.current?.focus()
    })
  }, [composeSignal])

  const submitPost = () => {
    const content = draft.trim()
    if (!content) return
    setPosts((prev) => [
      {
        id: nextId,
        author: "You",
        handle: "@you",
        avatar: "🙂",
        time: "now",
        content,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      ...prev,
    ])
    setDraft("")
    composerRef.current?.focus()
  }

  return (
    <div>
      {/* Post Composer */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-[#ff5757] rounded-full flex items-center justify-center text-sm flex-shrink-0">JD</div>
          <div className="flex-1">
            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="What's happening on campus?"
              className={`w-full bg-transparent text-gray-400 text-lg focus:outline-none mb-3 resize-none rounded-lg ${
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
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">
                  📷 Photo
                </button>
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">
                  📊 Poll
                </button>
                <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">
                  📍 Event
                </button>
              </div>
              <button
                onClick={submitPost}
                className="bg-[#ff5757] text-white px-5 py-2 rounded-lg hover:bg-[#ff4545] transition-colors disabled:opacity-50 disabled:hover:bg-[#ff5757]"
                disabled={!draft.trim()}
                title="Post (Ctrl/⌘+Enter)"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-800 p-6 hover:bg-[#0d0d0d] transition-colors">
            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">{post.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{post.author}</span>
                  <span className="text-gray-500 text-sm">{post.handle}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-500 text-sm">{post.time}</span>
                </div>
                <p className="text-gray-300 mb-3">{post.content}</p>

                {post.hasImage && (
                  <div className="bg-[#1a1a1a] rounded-xl h-64 mb-3 flex items-center justify-center text-gray-600">
                    Campus Photo
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-500 max-w-md">
                  <button className="flex items-center gap-2 hover:text-[#ff5757] transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-[#ff5757]/10">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{post.shares}</span>
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#1a1a1a] transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="p-2 h-fit rounded-full hover:bg-[#1a1a1a] transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

