import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initSocket } from "./sockets/socket.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/messages", messageRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test routes
app.get("/", (req, res) => {
  res.send("Express backend running");
});

app.get("/test-user", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const server = http.createServer(app);

// 🔌 Socket setup
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

// 🔐 Socket authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// 🔁 Socket connection
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.user?.userId;

  socket.currentRoom = null;

  if (userId) {
    onlineUsers.set(userId, socket.id);
  }

  io.emit("online_users", Array.from(onlineUsers.keys()));

  // =========================
  // JOIN ROOM
  // =========================
  socket.on("join_room", (room) => {
    socket.join(room);
    socket.currentRoom = room;
  });

  // =========================
  // SEND MESSAGE
  // =========================
  socket.on("send_message", async ({ room, text }) => {
    const sender = socket.user.userId;

    const message = await Message.create({
      room,
      sender,
      text,
      status: "sent",
      seenBy: [sender],
    });

    const populated = await message.populate("sender", "username");

    io.to(room).emit("receive_message", populated);
  });

  // =========================
  // ✔✔ DELIVERED
  // =========================
  socket.on("message_delivered", async ({ messageId, room }) => {
    await Message.findByIdAndUpdate(messageId, {
      status: "delivered",
    });

    io.to(room).emit("message_status", {
      messageId,
      status: "delivered",
    });
  });

  // =========================
  // 👁️ SEEN (STRICT LOGIC)
  // =========================
  socket.on("message_seen", async ({ messageId }) => {
    const msg = await Message.findById(messageId);
    if (!msg) return;

    const userId = socket.user.userId;

    // ❌ user must be in that room
    if (socket.currentRoom !== msg.room) return;

    // ❌ user must be online
    if (!onlineUsers.has(userId)) return;

    // ❌ don't mark sender
    if (msg.sender.toString() === userId) return;

    // avoid duplicates
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

  // =========================
  // TYPING
  // =========================
  socket.on("typing", (room) => {
    socket.to(room).emit("typing", { userId });
  });

  socket.on("stop_typing", (room) => {
    socket.to(room).emit("stop_typing", { userId });
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});
// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// 🔍 Debug (optional)
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");