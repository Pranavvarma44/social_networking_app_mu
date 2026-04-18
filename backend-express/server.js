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

app.use(cors());
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

// 🔥 SOCKET SETUP
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

// PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});