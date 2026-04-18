import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import axios from "axios"

const API = import.meta.env.VITE_API_URL
const SOCKET_URL = API.replace("/api", "")

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
})

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [showUsers, setShowUsers] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  const token = localStorage.getItem("token")

  // ✅ SAFE TOKEN
  let myId: string | null = null
  if (token) {
    try {
      const parts = token.split(".")
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        myId = payload.userId
      }
    } catch {
      localStorage.removeItem("token")
    }
  }

  if (!myId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please login again</p>
      </div>
    )
  }

  // ✅ SOCKET CONNECT + JOIN (RUNS ONCE)
  useEffect(() => {
    socket.connect()

    const handleConnect = () => {
      console.log("CONNECTED:", myId)
      socket.emit("join", myId)
    }

    socket.on("connect", handleConnect)

    return () => {
      socket.off("connect", handleConnect)
    }
  }, [myId])

  // ✅ MESSAGE LISTENERS (SEPARATE)
  useEffect(() => {
    const handleReceive = (msg: any) => {
      console.log("RECEIVED:", msg)

      setMessages((prev) => {
        // prevent duplicates
        if (prev.some((m) => m._id === msg._id)) return prev

        // only update if chat open
        if (
          msg.sender === selectedUser ||
          msg.receiver === selectedUser
        ) {
          return [...prev, msg]
        }

        return prev
      })
    }

    const handleSent = (msg: any) => {
      console.log("SENT:", msg)

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    }

    socket.on("receive_message", handleReceive)
    socket.on("message_sent", handleSent)

    return () => {
      socket.off("receive_message", handleReceive)
      socket.off("message_sent", handleSent)
    }
  }, [selectedUser])

  // 🔹 conversations
  useEffect(() => {
    axios.get(`${API}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setConversations(res.data.conversations))
  }, [])

  // 🔹 fetch users for new chat
  useEffect(() => {
    if (!showUsers) return

    axios.get(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const filtered = res.data.users.filter((u: any) => u._id !== myId)
      setUsers(filtered)
    })
  }, [showUsers])

  // 🔹 open chat
  const openChat = async (userId: string) => {
    setSelectedUser(userId)

    const res = await axios.get(`${API}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setMessages(res.data.messages)
  }

  // 🔹 send message
  const sendMessage = () => {
    if (!text || !selectedUser) return

    socket.emit("send_message", {
      receiver: selectedUser,
      content: text
    })

    setText("")
  }

  return (
    <div className="flex h-screen">

      {/* LEFT */}
      <div className="w-1/3 border-r p-4">
        <h2 className="font-bold mb-4">Chats</h2>

        <button
          onClick={() => setShowUsers(!showUsers)}
          className="mb-3 bg-black text-white px-3 py-1 rounded"
        >
          {showUsers ? "Close" : "New Chat"}
        </button>

        {/* NEW CHAT USER LIST */}
        {showUsers && (
          <div className="border p-2 mb-3 max-h-40 overflow-y-auto">
            <p className="font-semibold mb-2">Select user</p>

            {users.map((u) => (
              <div
                key={u._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedUser(u._id)
                  setMessages([])
                  setShowUsers(false)
                }}
              >
                {u.name}
              </div>
            ))}
          </div>
        )}

        {/* EXISTING CHATS */}
        {conversations.length === 0 && (
          <p className="text-gray-500">No chats yet</p>
        )}

        {conversations.map((c, i) => (
          <div
            key={i}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              selectedUser === c.userId ? "bg-gray-200" : ""
            }`}
            onClick={() => openChat(c.userId)}
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-gray-500">{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex-1 p-4 flex flex-col">

        <div className="flex-1 overflow-y-auto">
          {messages.map((m, i) => {
            const isMe = m.sender === myId

            return (
              <div
                key={i}
                className={`mb-2 flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`px-3 py-2 rounded ${
                    isMe
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            )
          })}
        </div>

        {selectedUser && (
          <div className="flex gap-2 mt-4">
            <input
              className="border p-2 flex-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white px-4"
            >
              Send
            </button>
          </div>
        )}

      </div>
    </div>
  )
}