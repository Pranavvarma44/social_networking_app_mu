import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import BASE_URL from "../../api"
import { createSocket } from "../../socket"

export default function GroupPage({ groupId, onBack }: any) {

  const [group, setGroup] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [showMembers, setShowMembers] = useState(false)

  const socketRef = useRef<any>(null)

  const token = localStorage.getItem("token")

  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId
    }
  } catch {}

  // ================= FETCH GROUP =================
  const fetchGroup = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/study-groups/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setGroup(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/group-messages/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!groupId) return
    fetchGroup()
    fetchMessages()
  }, [groupId])

  // ================= SOCKET =================
  useEffect(() => {
    if (!token) return

    const socket = createSocket(token)
    socketRef.current = socket

    socket.emit("join_room", groupId)

    socket.on("receive_group_message", (msg: any) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [groupId])

  // ================= SEND =================
  const sendMessage = () => {
    if (!text.trim()) return

    socketRef.current.emit("send_group_message", {
      groupId,
      text,
    })

    setText("")
  }

  // ================= JOIN =================
  const handleJoin = async () => {
    await axios.post(
      `${BASE_URL}/api/study-groups/${groupId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchGroup()
  }

  // ================= LEAVE =================
  const handleLeave = async () => {
    await axios.post(
      `${BASE_URL}/api/study-groups/${groupId}/leave`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchGroup()
  }

  // ================= KICK =================
  const handleKick = async (userId: string) => {
    await axios.post(
      `${BASE_URL}/api/study-groups/${groupId}/kick`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchGroup()
  }

  const isMember = group?.members?.some(
    (m: any) => (m._id || m) === currentUserId
  )

  const isAdmin =
    group?.createdBy?._id?.toString() === currentUserId?.toString()

  if (!group) return <div className="p-6 text-gray-400">Loading...</div>

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* ================= HEADER ================= */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">

        <div>
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="text-sm text-gray-400">{group.subject}</p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setShowMembers(true)}
            className="bg-[#1a1a1a] px-3 py-1 rounded text-sm"
          >
            Members
          </button>

          {isMember ? (
            <button
              onClick={handleLeave}
              className="bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="bg-[#ff5757] px-3 py-1 rounded text-sm"
            >
              Join
            </button>
          )}

        </div>
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg) => {

          const isMe =
            (msg.sender?._id || msg.sender) === currentUserId

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : ""}`}
            >
              <div
                className={`px-4 py-2 rounded ${
                  isMe ? "bg-[#ff5757]" : "bg-gray-800"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-gray-300">
                    {msg.sender?.name}
                  </p>
                )}
                <p>{msg.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ================= INPUT ================= */}
      {isMember && (
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-[#1a1a1a] px-4 py-2 rounded"
            placeholder="Type message..."
          />

          <button
            onClick={sendMessage}
            className="bg-[#ff5757] px-4 rounded"
          >
            Send
          </button>
        </div>
      )}

      {/* ================= MEMBERS MODAL ================= */}
      {showMembers && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowMembers(false)}
        >
          <div
            className="bg-[#111] w-96 max-h-[70vh] rounded-lg p-4 border border-gray-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Members</h2>

              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            {/* LIST */}
            {group.members.map((m: any) => {

              const id = m._id || m

              return (
                <div
                  key={id}
                  className="flex justify-between items-center p-2 hover:bg-[#1a1a1a] rounded"
                >
                  <span>{m.name || "User"}</span>

                  {isAdmin && id !== currentUserId && (
                    <button
                      onClick={() => handleKick(id)}
                      className="text-xs text-red-400"
                    >
                      Kick
                    </button>
                  )}
                </div>
              )
            })}

          </div>
        </div>
      )}

    </div>
  )
}