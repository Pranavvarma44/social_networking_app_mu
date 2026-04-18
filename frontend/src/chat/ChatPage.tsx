import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import axios from "axios"

const API = import.meta.env.VITE_API_URL
const SOCKET_URL = API.replace("/api", "")

// ⚠️ create socket OUTSIDE component (only once)
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
})

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [text, setText] = useState("")

  const token = localStorage.getItem("token")
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null
  const myId = user?.userId

  // 🔹 SOCKET SETUP
  useEffect(() => {
    if (!myId) return

    socket.emit("join", myId)

    // receive message (from others)
    socket.on("receive_message", (msg) => {
      console.log("RECEIVED:", msg)

      // only update if current chat is open
      if (
        msg.sender === selectedUser ||
        msg.receiver === selectedUser
      ) {
        setMessages((prev) => [...prev, msg])
      }
    })

    // message sent (self)
    socket.on("message_sent", (msg) => {
      console.log("SENT:", msg)
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("receive_message")
      socket.off("message_sent")
    }
  }, [selectedUser, myId])

  // 🔹 Fetch conversations
  useEffect(() => {
    if (!token) return

    axios.get(`${API}/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setConversations(res.data.conversations))
  }, [])

  // 🔹 Open chat
  const openChat = async (userId: string) => {
    setSelectedUser(userId)

    const res = await axios.get(`${API}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setMessages(res.data.messages)
  }

  // 🔹 Send message
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

      {/* LEFT: Conversations */}
      <div className="w-1/3 border-r p-4">
        <h2 className="font-bold mb-4">Chats</h2>

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

      {/* RIGHT: Chat */}
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