import { useState } from "react"
import {
  Bell,
  Bookmark,
  Calendar,
  Heart,
  Home as HomeIcon,
  LogOut,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Search,
  Share2,
  Users,
} from "lucide-react"
import EventsPage from "../Pages/EventsPage"
import MessagesPage from "../Pages/MessagesPage"
import StudyGroupsPage from "../Pages/StudyGroupsPage"

interface HomeProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export default function Home({ isAuthenticated, setIsAuthenticated }: HomeProps) {
  const [activeTab, setActiveTab] = useState('home');

  const posts = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      handle: '@sarahj',
      avatar: '👩‍🎓',
      time: '2h',
      content: 'Just finished my CS project! The team collaboration was amazing. Can\'t wait for the showcase next week! 🎉',
      likes: 124,
      comments: 18,
      shares: 5,
      hasImage: true,
      imageType: 'campus'
    },
    {
      id: 2,
      author: 'Jordan Smith',
      handle: '@jordans',
      avatar: '👨‍💼',
      time: '4h',
      content: 'Anyone else excited for the basketball game tonight? Let\'s go MU! 🏀',
      likes: 89,
      comments: 12,
      shares: 3,
    },
    {
      id: 3,
      author: 'Emily Wang',
      handle: '@emilyw',
      avatar: '👩‍🔬',
      time: '6h',
      content: 'Study group meet at the library at 6pm. We\'re tackling the physics final review. All are welcome!',
      likes: 45,
      comments: 7,
      shares: 8,
    }
  ];

  const trending = [
    { tag: '#WelcomeWeek', posts: '2.4k' },
    { tag: '#MUBasketball', posts: '1.8k' },
    { tag: '#CampusParking', posts: '956' },
    { tag: '#FinalsSeason', posts: '743' },
  ];

  const suggestions = [
    { name: 'Jordan Smith', handle: '@jordans', mutual: '12 mutual' },
    { name: 'Emily Tan', handle: '@emilyt', mutual: '8 mutual' },
    { name: 'Marcus West', handle: '@marcusw', mutual: '5 mutual' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl flex items-center gap-2">
              <span className="text-2xl"></span> <span className="text-[#ff5757]">MU</span> SOCIAL.
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search MU Social..."
                className="bg-[#1a1a1a] border border-gray-800 rounded-full pl-10 pr-4 py-2 w-80 text-sm focus:outline-none focus:border-[#ff5757]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5757] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-[#ff5757] rounded-full flex items-center justify-center text-sm">
              JD
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-800 min-h-screen sticky top-16 p-6">
          <nav className="space-y-2">
            <NavItem icon={HomeIcon} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon={Users} label="Campus Feed" active={activeTab === 'campus'} onClick={() => setActiveTab('campus')} />
            <NavItem icon={MessageCircle} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
            <NavItem icon={Users} label="Study Groups" active={activeTab === 'study'} onClick={() => setActiveTab('study')} />
            <NavItem icon={Calendar} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          </nav>

          <button className="w-full bg-[#ff5757] text-white py-3 rounded-lg mt-6 hover:bg-[#ff4545] transition-colors">
            Create Post
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 border-r border-gray-800">
          {activeTab === "messages" ? (
            <MessagesPage />
          ) : activeTab === "events" ? (
            <EventsPage />
          ) : activeTab === "study" ? (
            <StudyGroupsPage />
          ) : (
            <div>
              {/* Post Composer */}
              <div className="border-b border-gray-800 p-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#ff5757] rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    JD
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="What's happening on campus?"
                      className="w-full bg-transparent text-gray-400 text-lg focus:outline-none mb-3"
                    />
                    <div className="flex gap-4">
                      <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">📷 Photo</button>
                      <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">📊 Poll</button>
                      <button className="px-4 py-1 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors">📍 Event</button>
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
          )}
        </div>

        {/* Right Sidebar */}
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
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <div className="text-gray-600">© 2026 MU Social</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-[#ff5757] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
