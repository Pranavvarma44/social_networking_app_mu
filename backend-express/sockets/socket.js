import Message from "../models/Message.js";

const onlineUsers = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User joined:", userId);
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      const { sender, receiver, content } = data;

      try {
        // Save message
        const message = await Message.create({
          sender,
          receiver,
          content,
        });

        // Send to receiver
        const receiverSocket = onlineUsers.get(receiver);

        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", message);
        }

        // Send back to sender
        socket.emit("message_sent", message);

      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected");

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};