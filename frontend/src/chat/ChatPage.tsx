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

  // ✅ SAFE TOKEN DECODE
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
  // FETCH GROUPS
  // =========================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("GROUPS:", res.data);
        setGroups(res.data);
      })
      .catch(console.error);
  }, [token]);

  // =========================
  // FETCH USERS (FIXED)
  // =========================
  useEffect(() => {
    if (!token || !currentUserId) return;

    axios
      .get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("USERS RESPONSE:", res.data);

        const userList = res.data.users || res.data;

        const filtered = userList.filter(
          (u: any) => u._id !== currentUserId
        );

        setUsers(filtered);
      })
      .catch((err) => {
        console.error("USERS ERROR:", err.response?.data || err.message);
      });
  }, [token, currentUserId]);

  // =========================
  // SOCKET INIT
  // =========================
  useEffect(() => {
    if (!token) return;

    socketRef.current = createSocket(token);
    const socket = socketRef.current;

    socket.on("receive_message", (msg: any) => {
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
      .get(`${BASE_URL}/api/messages/${room}`, {
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
    <div className="h-screen flex flex-col bg-gray-100">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-1/4 bg-white border-r p-4">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>

          <p className="text-xs text-gray-400 mb-2">Users</p>

          {users.length === 0 && (
            <p className="text-gray-400 text-sm">No users found</p>
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
                className={`flex justify-between px-4 py-3 rounded-xl mb-2 cursor-pointer ${
                  isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                {user.name} {/* ✅ FIXED */}
                <span className={isOnline ? "text-green-500" : "text-gray-400"}>
                  ●
                </span>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 mt-4 mb-2">Groups</p>

          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedUser(null);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {group.name}
            </div>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="flex flex-col flex-1">

          <div className="bg-white border-b p-4">
            {selectedUser?.name || selectedGroup?.name || "Select chat"}
            {typingUserId && (
              <span className="text-gray-400 ml-2">Typing...</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m) => {
              const isMe = m.sender?._id === currentUserId;

              return (
                <div key={m._id} className={`flex ${isMe ? "justify-end" : ""}`}>
                  <div className={`p-2 rounded ${isMe ? "bg-blue-500 text-white" : "bg-white"}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {(selectedUser || selectedGroup) && (
            <div className="p-4 flex gap-2 bg-white">
              <input
                value={text}
                onChange={handleTyping}
                className="flex-1 border p-2 rounded"
              />
              <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}