import React, { useEffect, useRef } from "react"
import { Bell, Heart, MessageCircle, UserPlus, Briefcase, X } from "lucide-react"

type Notification = {
  id: number
  type: "like" | "comment" | "follow" | "opportunity" | "mention"
  actor: string
  avatar: string
  text: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "like",
    actor: "Sarah Jenkins",
    avatar: "👩‍🎓",
    text: "liked your post about the CS project.",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    actor: "Jordan Smith",
    avatar: "👨‍💼",
    text: "commented on your post: \"Great work!\"",
    time: "15m ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    actor: "Emily Wang",
    avatar: "👩‍🔬",
    text: "started following you.",
    time: "1h ago",
    read: true,
  },
  {
    id: 4,
    type: "opportunity",
    actor: "MU Research Lab",
    avatar: "🏫",
    text: "posted a new opportunity that matches your profile.",
    time: "3h ago",
    read: true,
  },
  {
    id: 5,
    type: "mention",
    actor: "Marcus Davis",
    avatar: "👨‍🎓",
    text: "mentioned you in a study group post.",
    time: "5h ago",
    read: true,
  },
]

const iconMap = {
  like: <Heart className="w-4 h-4 text-[#ff5757]" />,
  comment: <MessageCircle className="w-4 h-4 text-blue-400" />,
  follow: <UserPlus className="w-4 h-4 text-green-400" />,
  opportunity: <Briefcase className="w-4 h-4 text-yellow-400" />,
  mention: <Bell className="w-4 h-4 text-purple-400" />,
}

interface NotificationsPanelProps {
  onClose: () => void
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-[#111] border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      style={{ animation: "slideDown 0.2s ease" }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#ff5757] text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-[#ff5757] hover:underline">Mark all read</button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a1a1a] rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 px-5 py-4 border-b border-gray-900 hover:bg-[#1a1a1a] transition-colors cursor-pointer ${
              !notif.read ? "bg-[#ff5757]/5" : ""
            }`}
          >
            {/* Avatar + icon badge */}
            <div className="relative flex-shrink-0">
              <div className="text-2xl">{notif.avatar}</div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#111] rounded-full p-0.5">
                {iconMap[notif.type]}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200">
                <span className="font-semibold text-white">{notif.actor}</span>{" "}
                {notif.text}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
            </div>

            {/* Unread dot */}
            {!notif.read && (
              <div className="w-2 h-2 bg-[#ff5757] rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 text-center">
        <button className="text-sm text-[#ff5757] hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  )
}
