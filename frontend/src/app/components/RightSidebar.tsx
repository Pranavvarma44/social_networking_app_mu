import React from "react"

type TrendingItem = { tag: string; posts: string }
type SuggestionItem = { name: string; handle: string; mutual: string }

export default function RightSidebar() {
  const trending: TrendingItem[] = [
    { tag: "#WelcomeWeek", posts: "2.4k" },
    { tag: "#MUBasketball", posts: "1.8k" },
    { tag: "#CampusParking", posts: "956" },
    { tag: "#FinalsSeason", posts: "743" },
  ]

  const suggestions: SuggestionItem[] = [
    { name: "Jordan Smith", handle: "@jordans", mutual: "12 mutual" },
    { name: "Emily Tan", handle: "@emilyt", mutual: "8 mutual" },
    { name: "Marcus West", handle: "@marcusw", mutual: "5 mutual" },
  ]

  return (
    <div className="w-80 p-6 space-y-6">
      {/* Trending */}
      <div className="bg-[#1a1a1a] rounded-xl p-4">
        <h3 className="text-lg mb-4">Trending on Campus</h3>
        <div className="space-y-4">
          {trending.map((item, i) => (
            <div key={i} className="hover:bg-[#252525] p-2 rounded-lg transition-colors cursor-pointer">
              <div className="text-[#ff5757] text-sm mb-1">{item.tag}</div>
              <div className="text-gray-500 text-xs">{item.posts} posts</div>
            </div>
          ))}
          <button className="text-[#ff5757] text-sm hover:underline">Show more</button>
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-[#1a1a1a] rounded-xl p-4">
        <h3 className="text-lg mb-4">Classmates you might know</h3>
        <div className="space-y-3">
          {suggestions.map((user, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div>
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.mutual}</div>
                </div>
              </div>
              <button className="px-4 py-1 bg-white text-black text-sm rounded-full hover:bg-gray-200 transition-colors">
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="text-xs text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-3">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <div className="text-gray-600">© 2026 MU Social</div>
      </div>
    </div>
  )
}

