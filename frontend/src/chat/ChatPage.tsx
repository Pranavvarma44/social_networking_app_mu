import { useEffect, useState, useRef } from "react";
import axios from "axios";
import BASE_URL from "../api";
import { createSocket } from "../socket";
import Navbar from "../components/Navbar";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const roomRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("token");

  // ✅ SAFE TOKEN
  let currentUserId: string | null = null;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.userId ?? payload.id ?? payload._id;
    }
  } catch {
    localStorage.removeItem("token");
  }

  const room = selectedGroup
    ? `group_${selectedGroup._id}`
    : selectedUser
    ? [currentUserId, selectedUser._id].sort().join("_")
    : null;

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    if (!token || !currentUserId) return;

    axios
      .get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("USERS:", res.data);
        const userList = res.data.users || res.data;
        setUsers(userList.filter((u: any) => u._id !== currentUserId));
      })
      .catch((err) => console.error("USER ERROR:", err));
  }, [token, currentUserId]);

  // =========================
  // FETCH GROUPS
  // =========================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${BASE_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, [token]);

  // =========================
  // SOCKET INIT (FIXED)
  // =========================
  useEffect(() => {
    if (!token || !currentUserId) return;

    socketRef.current = createSocket(token);
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ CONNECTED:", socket.id);

      // 🔥 JOIN for online tracking
      socket.emit("join", currentUserId);
    });

    socket.on("connect_error", (err: any) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    socket.on("receive_message", (msg: any) => {
      console.log("📩 RECEIVED:", msg);

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      socket.emit("message_delivered", {
        messageId: msg._id,
        room: msg.room,
      });

      if (msg.room === roomRef.current) {
        socket.emit("message_seen", {
          messageId: msg._id,
        });
      }
    });

    socket.on("message_status", ({ messageId, status }: any) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status } : m
        )
      );
    });

    socket.on("online_users", (users: string[]) => {
      console.log("🟢 ONLINE:", users);
      setOnlineUsers(users);
    });

    socket.on("typing", ({ userId }: any) => {
      if (userId !== currentUserId) setTypingUserId(userId);
    });

    socket.on("stop_typing", () => {
      setTypingUserId(null);
    });

    return () => socket.disconnect();
  }, [token, currentUserId]);

  // =========================
  // ROOM CHANGE
  // =========================
  useEffect(() => {
    if (!room || !token) return;

    setMessages([]);
    setTypingUserId(null);

    socketRef.current?.emit("join_room", room);

    axios
      .get(`${BASE_URL}/messages/${room}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data);

        res.data.forEach((msg: any) => {
          if (
            msg.status !== "seen" &&
            msg.sender?._id !== currentUserId
          ) {
            socketRef.current.emit("message_seen", {
              messageId: msg._id,
            });
          }
        });
      })
      .catch(console.error);
  }, [room, token, currentUserId]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = () => {
    if (!text.trim() || !room) return;

    console.log("📤 SENDING:", { room, text });

    socketRef.current.emit("send_message", { room, text });
    socketRef.current.emit("stop_typing", room);

    setText("");
  };

  // =========================
  // TYPING
  // =========================
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (!room) return;

    socketRef.current.emit("typing", room);

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", room);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar />
  
      <div className="flex flex-1 overflow-hidden">
  
        {/* SIDEBAR */}
        <div className="w-1/4 bg-[#0f0f0f] border-r border-gray-800 p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Chats</h2>
  
          <p className="text-xs text-gray-500 mb-2">Users</p>
  
          {users.length === 0 && (
            <p className="text-gray-600 text-sm">No users found</p>
          )}
  
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isActive = selectedUser?._id === user._id;
  
            return (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null);
                }}
                className={`flex justify-between px-3 py-2 rounded-lg cursor-pointer mb-1 transition ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-gray-800"
                }`}
              >
                {user.name}
                <span className={isOnline ? "text-green-400" : "text-gray-600"}>
                  ●
                </span>
              </div>
            );
          })}
  
          <p className="text-xs text-gray-500 mt-6 mb-2">Groups</p>
  
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedUser(null);
              }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 mb-1"
            >
              {group.name}
            </div>
          ))}
        </div>
  
        {/* CHAT AREA */}
        <div className="flex flex-col flex-1 bg-black">
  
          {/* HEADER */}
          <div className="border-b border-gray-800 px-6 py-4 bg-[#111]">
            <h2 className="font-semibold text-white">
              {selectedUser?.name || selectedGroup?.name || "Select chat"}
            </h2>
            {typingUserId && (
              <span className="text-gray-500 text-sm">Typing...</span>
            )}
          </div>
  
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.map((m) => {
              const isMe = m.sender?._id === currentUserId;
  
              return (
                <div
                  key={m._id}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-xs ${
                      isMe
                        ? "bg-white text-black"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
  
          {/* INPUT */}
          {(selectedUser || selectedGroup) && (
            <div className="p-4 bg-[#111] border-t border-gray-800 flex gap-2">
              <input
                value={text}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-white"
              />
              <button
                onClick={sendMessage}
                className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}