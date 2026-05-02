import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import User from "./models/User.js";
import Message from "./models/Message.js";
import GroupMessage from "./models/GroupMessage.js"; // ✅ ADD

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import studyGroupRoutes from "./routes/studyGroups.js";
import groupMessageRoutes from "./routes/groupMessageRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/messages", messageRoutes); // DM
app.use("/api/posts", postRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/study-groups", studyGroupRoutes);
app.use("/api/group-messages", groupMessageRoutes); // GROUP

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// 🔐 AUTH
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

// ================= CONNECTION =================
const onlineUsers = new Map();

io.on("connection", (socket) => {

  const userId = socket.user?.userId;

  if (userId) {
    onlineUsers.set(userId.toString(), socket.id);
  }

  io.emit("online_users", Array.from(onlineUsers.keys()));

  console.log("🟢 Connected:", userId);

  // ================= DM ROOM =================
  socket.on("join_room", (room) => {
    socket.join(room);
    socket.currentRoom = room;
  });

  // ================= GROUP ROOM =================
  socket.on("join_group", (groupId) => {
    socket.join(groupId);
    console.log("👥 Joined group:", groupId);
  });

  // ================= 💬 DM MESSAGE =================
  socket.on("send_message", async ({ room, text }) => {
    try {
      const sender = userId;

      const message = await Message.create({
        room,
        text,
        sender,
        status: "sent",
        seenBy: [sender],
      });

      const populated = await message.populate("sender", "name");

      io.to(room).emit("receive_message", populated);

    } catch (err) {
      console.error("❌ DM ERROR:", err);
    }
  });

  // ================= 💬 GROUP MESSAGE =================
  socket.on("send_group_message", async ({ groupId, text }) => {
    try {
      const sender = userId;

      const message = await GroupMessage.create({
        group: groupId,
        sender,
        text,
      });

      const populated = await message.populate("sender", "name");

      io.to(groupId).emit("receive_group_message", populated);

      console.log("📨 Group message:", text);

    } catch (err) {
      console.error("❌ GROUP ERROR:", err);
    }
  });

  // ================= ✔ DELIVERED =================
  socket.on("message_delivered", async ({ messageId, room }) => {
    await Message.findByIdAndUpdate(messageId, {
      status: "delivered",
    });

    io.to(room).emit("message_status", {
      messageId,
      status: "delivered",
    });
  });

  // ================= 👁 SEEN =================
  socket.on("message_seen", async ({ messageId }) => {
    const msg = await Message.findById(messageId);
    if (!msg) return;

    if (msg.sender?.toString() === userId) return;

    if (!msg.seenBy.includes(userId)) {
      msg.seenBy.push(userId);
    }

    msg.status = "seen";
    await msg.save();

    io.to(msg.room).emit("message_status", {
      messageId,
      status: "seen",
    });
  });

  // ================= ✍️ TYPING =================
  socket.on("typing", (room) => {
    socket.to(room).emit("typing", { userId });
  });

  socket.on("stop_typing", (room) => {
    socket.to(room).emit("stop_typing", { userId });
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId.toString());
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));

    console.log("🔴 Disconnected:", userId);
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});