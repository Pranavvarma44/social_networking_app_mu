import { useMemo, useState } from "react"
import {
  Image as ImageIcon,
  Info,
  MessageCircle,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react"

type Conversation = {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  isGroup?: boolean
}

type Message = {
  id: number
  sender: "me" | "them"
  text: string
  time: string
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const conversations: Conversation[] = useMemo(
    () => [
      {
        id: 1,
        name: "Sarah Jenkins",
        avatar: "👩‍🎓",
        lastMessage: "See you at the library!",
        time: "2m",
        unread: 2,
        online: true,
      },
      {
        id: 2,
        name: "Study Group",
        avatar: "📚",
        lastMessage: "Physics final is going to be tough",
        time: "15m",
        unread: 0,
        online: false,
        isGroup: true,
      },
      {
        id: 3,
        name: "Jordan Smith",
        avatar: "👨‍💼",
        lastMessage: "Did you finish the assignment?",
        time: "1h",
        unread: 0,
        online: true,
      },
      {
        id: 4,
        name: "Emily Wang",
        avatar: "👩‍🔬",
        lastMessage: "Thanks for the notes!",
        time: "3h",
        unread: 0,
        online: false,
      },
      {
        id: 5,
        name: "Marcus Davis",
        avatar: "👨‍🎓",
        lastMessage: "Game tonight at 7?",
        time: "5h",
        unread: 1,
        online: true,
      },
    ],
    [],
  )

  const messages: Message[] = useMemo(
    () => [
      { id: 1, sender: "them", text: "Hey! Are you coming to the library today?", time: "10:30 AM" },
      { id: 2, sender: "me", text: "Yes! I'll be there around 2pm", time: "10:32 AM" },
      { id: 3, sender: "them", text: "Perfect! I'll save you a spot", time: "10:33 AM" },
      { id: 4, sender: "me", text: "Thanks! Do you need me to bring anything?", time: "10:35 AM" },
      { id: 5, sender: "them", text: "Just your laptop. We can share my textbook", time: "10:36 AM" },
      { id: 6, sender: "them", text: "See you at the library!", time: "10:37 AM" },
    ],
    [],
  )

  const activeConversation = selectedChat
    ? conversations.find((c) => c.id === selectedChat) ?? null
    : null

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ff5757]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-[#1a1a1a] transition-colors border-b border-gray-800 ${
                selectedChat === conv.id ? "bg-[#1a1a1a]" : ""
              }`}
            >
              <div className="relative">
                <div className="text-3xl">{conv.avatar}</div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{conv.name}</span>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 bg-[#ff5757] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="text-3xl">{activeConversation.avatar}</div>
                {activeConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{activeConversation.name}</h3>
                <p className="text-xs text-gray-500">{activeConversation.online ? "Active now" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md ${msg.sender === "me" ? "bg-[#ff5757]" : "bg-[#1a1a1a]"} rounded-2xl px-4 py-2`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-300 mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-full px-4 py-2 focus:outline-none focus:border-[#ff5757]"
              />
              <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-3 bg-[#ff5757] rounded-full hover:bg-[#ff4545] transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

