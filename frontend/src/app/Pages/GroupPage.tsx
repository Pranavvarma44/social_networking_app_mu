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
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const token = localStorage.getItem("token")

  // 🔐 CURRENT USER
  let currentUserId: string | null = null
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserId = payload._id || payload.userId
    }
  } catch {}

  // ================= CHECK MEMBER =================
  const isMember = group?.members?.some(
    (m: any) => (m._id || m).toString() === currentUserId
  )

  // ================= SOCKET =================
  useEffect(() => {
    if (!token) return

    const socket = createSocket(token)
    socketRef.current = socket

    socket.on("receive_group_message", (msg: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    })

    return () => socket.disconnect()
  }, [token])

  // ================= JOIN GROUP ROOM =================
  useEffect(() => {
    if (!groupId || !isMember) return
    socketRef.current?.emit("join_group", groupId)
  }, [groupId, isMember])

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
    if (!groupId || !token) return
    fetchGroup()
    fetchMessages()
  }, [groupId])

  // ================= JOIN =================
  const handleJoin = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGroup()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= LEAVE =================
  const handleLeave = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/study-groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGroup()
    } catch (err) {
      console.error(err)
    }
  }

  // ================= SEND =================
  const sendMessage = () => {
    if (!text.trim() || !groupId || !isMember) return

    socketRef.current.emit("send_group_message", {
      groupId,
      text,
    })

    setText("")
  }

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!group) {
    return <div className="p-6 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">

      {/* HEADER */}
      <div className="mb-4 border-b border-gray-800 pb-3 flex justify-between items-center">

        <button onClick={onBack} className="text-gray-400">
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold">{group.name}</h2>

          {/* 🔥 CLICKABLE MEMBERS */}
          <p
            onClick={() => setShowMembers(true)}
            className="text-xs text-gray-400 cursor-pointer hover:underline"
          >
            {group.members?.length} members
          </p>
        </div>

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

      {/* ================= CHAT ================= */}
      {isMember ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">

            {messages.map((msg) => {
              const isMe = msg.sender?._id === currentUserId

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : ""}`}
                >
                  <div
                    className={`px-4 py-2 rounded max-w-[70%] text-sm ${
                      isMe
                        ? "bg-[#ff5757] text-white"
                        : "bg-[#1a1a1a] text-gray-300"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs text-gray-400">
                        {msg.sender?.name}
                      </div>
                    )}

                    <p>{msg.text}</p>
                  </div>
                </div>
              )
            })}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="mt-3 flex gap-2 border-t border-gray-800 pt-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-[#1a1a1a] px-3 py-2 rounded outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-[#ff5757] px-4 rounded hover:bg-[#ff4545]"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Join the group to participate in chat
        </div>
      )}

      {/* ================= MEMBERS MODAL ================= */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#111] w-80 max-h-[70vh] rounded-xl p-4 border border-gray-800 overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg">Members</h2>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            {group.members?.map((m: any) => (
              <div
                key={m._id || m}
                className="flex justify-between items-center p-2 rounded hover:bg-[#1a1a1a]"
              >
                <span>
                  {m.name || "User"}
                  {group.createdBy === (m._id || m) && (
                    <span className="text-xs text-[#ff5757] ml-1">(Admin)</span>
                  )}
                </span>
              </div>
            ))}

            {group.members?.length === 0 && (
              <p className="text-gray-400 text-sm">No members</p>
            )}

          </div>
        </div>
      )}

    </div>
  )
}