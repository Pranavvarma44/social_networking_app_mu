import React,{ useMemo, useEffect, useState, useRef } from "react"
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
import axios from "axios";
import BASE_URL from "../../api";
import { createSocket } from "../../socket"


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

  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [messages, setMessages] = useState<any[]>([])

  const [text, setText] = useState("")

  const [users, setUsers] = useState<any[]>([])

  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const [typingUserId, setTypingUserId] = useState<string | null>(null)

  const socketRef = useRef<any>(null)

  const typingTimeoutRef = useRef<any>(null)

  const roomRef = useRef<string | null>(null)

  const token = localStorage.getItem("token")

  // ✅ decode token safely

  let currentUserId: string | null = null

  try {

    if (token) {

      const payload = JSON.parse(atob(token.split(".")[1]))

      currentUserId = payload.userId ?? payload.id ?? payload._id

    }

  } catch {

    localStorage.removeItem("token")

  }

  // ROOM

  const room = selectedUser

    ? [currentUserId, selectedUser._id].sort().join("_")

    : null

  useEffect(() => {

    roomRef.current = room

  }, [room])

  // ================= USERS =================

  useEffect(() => {

    if (!token || !currentUserId) return

    axios

      .get(`${BASE_URL}/api/users/chat-users`, {

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((res) => {

        const list = res.data.users || res.data

        setUsers(list.filter((u: any) => u._id !== currentUserId))

      })

      .catch(console.error)

  }, [token, currentUserId])

  // ================= SOCKET =================

  useEffect(() => {

    if (!token || !currentUserId) return

    socketRef.current = createSocket(token)

    const socket = socketRef.current

    socket.on("connect", () => {

      socket.emit("join", currentUserId)

    })

    socket.on("receive_message", (msg: any) => {

      setMessages((prev) => {

        if (prev.some((m) => m._id === msg._id)) return prev

        return [...prev, msg]

      })

      socket.emit("message_delivered", {

        messageId: msg._id,

        room: msg.room,

      })

      if (msg.room === roomRef.current) {

        socket.emit("message_seen", {

          messageId: msg._id,

        })

      }

    })

    socket.on("online_users", setOnlineUsers)

    socket.on("typing", ({ userId }: any) => {

      if (userId !== currentUserId) setTypingUserId(userId)

    })

    socket.on("stop_typing", () => setTypingUserId(null))

    return () => socket.disconnect()

  }, [token, currentUserId])

  // ================= LOAD MESSAGES =================

  useEffect(() => {

    if (!room || !token) return

    setMessages([])

    setTypingUserId(null)

    socketRef.current?.emit("join_room", room)

    axios

      .get(`${BASE_URL}/api/messages/${room}`, {

        headers: { Authorization: `Bearer ${token}` },

      })

      .then((res) => setMessages(res.data))

      .catch(console.error)

  }, [room, token])

  // ================= SEND =================

  const sendMessage = () => {

    if (!text.trim() || !room) return

    socketRef.current.emit("send_message", { room, text })

    socketRef.current.emit("stop_typing", room)

    setText("")

  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {

    setText(e.target.value)

    if (!room) return

    socketRef.current.emit("typing", room)

    clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {

      socketRef.current.emit("stop_typing", room)

    }, 1000)

  }

  return (

    <div className="flex h-[calc(100vh-4rem)] bg-black text-white">

      {/* SIDEBAR */}

      <div className="w-80 border-r border-gray-800 flex flex-col">

        <div className="p-4 border-b border-gray-800">

          <h2 className="text-xl mb-3">Messages</h2>

          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input className="w-full bg-[#1a1a1a] rounded-full pl-10 pr-4 py-2 text-sm" />

          </div>

        </div>

        <div className="flex-1 overflow-y-auto">

          {users.map((user) => {

            const isOnline = onlineUsers.includes(user._id)

            return (

              <button

                key={user._id}

                onClick={() => setSelectedUser(user)}

                className="w-full p-4 flex items-center gap-3 hover:bg-[#1a1a1a]"

              >

                <div className="relative text-2xl">👤

                  {isOnline && (

                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>

                  )}

                </div>

                <span>{user.name}</span>

              </button>

            )

          })}

        </div>

      </div>

      {/* CHAT */}

      {selectedUser ? (

        <div className="flex-1 flex flex-col">

          {/* HEADER */}

          <div className="p-4 border-b border-gray-800 flex justify-between">

            <span>{selectedUser.name}</span>

            {typingUserId && <span className="text-gray-400">Typing...</span>}

          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((msg) => {

              const isMe = msg.sender?._id === currentUserId

              return (

                <div key={msg._id} className={`flex ${isMe ? "justify-end" : ""}`}>

                  <div className={`px-4 py-2 rounded ${isMe ? "bg-red-500" : "bg-gray-800"}`}>

                    {msg.text}

                  </div>

                </div>

              )

            })}

          </div>

          {/* INPUT */}

          <div className="p-4 flex gap-2 border-t border-gray-800">

            <input

              value={text}

              onChange={handleTyping}

              className="flex-1 bg-[#1a1a1a] px-4 py-2 rounded"

            />

            <button onClick={sendMessage} className="bg-red-500 px-4 rounded">

              Send

            </button>

          </div>

        </div>

      ) : (

        <div className="flex-1 flex items-center justify-center text-gray-500">

          Select a chat

        </div>

      )}

    </div>

  )

}