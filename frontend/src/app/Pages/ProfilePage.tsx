import React, { useRef, useState } from "react"
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
import { Post } from "../Pages/PostsPage"

const userPosts: Post[] = [
  {
    id: 101,
    author: "JD",
    handle: "@jd",
    avatar: "🙂",
    time: "1d",
    content: "Just wrapped up the semester project – so proud of the team! 🎉",
    likes: 34,
    comments: 5,
    shares: 2,
  },
  {
    id: 102,
    author: "JD",
    handle: "@jd",
    avatar: "🙂",
    time: "3d",
    content: "Library vibes today — deep in finals prep. Wish me luck! 📚",
    likes: 22,
    comments: 3,
    shares: 0,
  },
  {
    id: 103,
    author: "JD",
    handle: "@jd",
    avatar: "🙂",
    time: "1w",
    content: "Attended the MU Basketball game last night. What a win! 🏀🔥",
    likes: 67,
    comments: 11,
    shares: 5,
  },
]

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [name, setName] = useState("John Doe")
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("John Doe")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [followers, setFollowers] = useState(128)
  const [following, setFollowing] = useState(74)
  const [posts] = useState<Post[]>(userPosts)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveName = () => {
    if (nameInput.trim()) setName(nameInput.trim())
    setEditingName(false)
  }

  const cancelName = () => {
    setNameInput(name)
    setEditingName(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) setProfilePic(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm">Back</span>
      </button>

      {/* Profile Card */}
      <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#ff5757]/30 via-[#ff5757]/10 to-transparent" />

        {/* Avatar + info row */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-full border-4 border-[#0d0d0d] overflow-hidden bg-[#ff5757] flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{name.split(" ").map((n) => n[0]).join("").toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#ff5757] rounded-full p-1.5 border-2 border-[#0d0d0d] hover:bg-[#ff4545] transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Follow / Edit */}
            <div className="flex items-center gap-2 mt-10">
              <button
                onClick={() => setFollowers((f) => f + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#ff5757] text-white rounded-lg text-sm hover:bg-[#ff4545] transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Follow
              </button>
            </div>
          </div>

          {/* Name & handle */}
          <div className="mb-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName()
                    if (e.key === "Escape") cancelName()
                  }}
                  className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xl font-bold focus:outline-none focus:border-[#ff5757] w-56"
                />
                <button onClick={saveName} className="p-1.5 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors">
                  <Check className="w-4 h-4 text-green-400" />
                </button>
                <button onClick={cancelName} className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{name}</h2>
                <button
                  onClick={() => { setEditingName(true); setNameInput(name) }}
                  className="p-1.5 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                  title="Edit name"
                >
                  <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            )}
            <p className="text-gray-500 text-sm">@{name.toLowerCase().replace(/\s+/g, "")}</p>
          </div>

          <p className="text-gray-400 text-sm mt-2 mb-4">
            MU Student · CS Major · Building cool things 🚀
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-t border-gray-800">
            <div className="text-center">
              <div className="text-xl font-bold">{posts.length}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <button
              className="text-center hover:opacity-80 transition-opacity"
              onClick={() => setFollowers((f) => f - 1)}
            >
              <div className="text-xl font-bold">{followers}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> Followers
              </div>
            </button>
            <div className="w-px h-8 bg-gray-800" />
            <button className="text-center hover:opacity-80 transition-opacity">
              <div className="text-xl font-bold">{following}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> Following
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Grid className="w-4 h-4 text-[#ff5757]" />
          <h3 className="font-semibold">Posts</h3>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-800 bg-[#0d0d0d] rounded-xl p-5 hover:bg-[#101010] transition-colors"
            >
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.author}</span>
                    <span className="text-gray-500 text-xs">{post.handle}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-500 text-xs">{post.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                  <div className="flex items-center gap-5 text-gray-500">
                    <button className="flex items-center gap-1.5 hover:text-[#ff5757] transition-colors text-sm">
                      <Heart className="w-4 h-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-sm">
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors text-sm">
                      <Share2 className="w-4 h-4" /> {post.shares}
                    </button>
                    <button className="ml-auto hover:text-white transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button className="p-1.5 h-fit hover:bg-[#1a1a1a] rounded-full transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
