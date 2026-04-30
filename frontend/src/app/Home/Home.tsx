import React, { useState } from "react"
import {
  Bell,
  Calendar,
  Home as HomeIcon,
  LogOut,
  MessageCircle,
  Search,
  Users,
} from "lucide-react"
import EventsPage from "../Pages/EventsPage"
import MessagesPage from "../Pages/MessagesPage"
import PostsPage from "../Pages/PostsPage"
import StudyGroupsPage from "../Pages/StudyGroupsPage"
import RightSidebar from "../components/RightSidebar"

interface HomeProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export default function Home({ isAuthenticated, setIsAuthenticated }: HomeProps) {
  const [activeTab, setActiveTab] = useState('home');

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
            <PostsPage />
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
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
