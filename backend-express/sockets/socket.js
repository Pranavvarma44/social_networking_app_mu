import Message from "../models/Message.js";

const onlineUsers = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔹 JOIN
    socket.on("join", (userId) => {
      if (!userId) return;

      const id = userId.toString(); // ✅ ensure string

      onlineUsers.set(id, socket.id);
      socket.userId = id;

      console.log("JOIN:", id);
      console.log("ONLINE USERS:", [...onlineUsers.entries()]);
    });

    // 🔹 SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        const { receiver, content } = data;

        const sender = socket.userId; // ✅ secure sender
        if (!sender) return;

        // save message
        const message = await Message.create({
          sender,
          receiver,
          content,
        });

        const receiverId = receiver.toString();
        const receiverSocket = onlineUsers.get(receiverId);

        console.log("SENDING FROM:", sender);
        console.log("TO:", receiverId);
        console.log("FOUND SOCKET:", receiverSocket);

        // send to receiver
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", message);
        } else {
          console.log("User offline → message stored only");
        }

        // send back to sender
        socket.emit("message_sent", message);

      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    // 🔹 DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log("REMOVED:", userId);
          break;
        }
      }

      console.log("ONLINE USERS:", [...onlineUsers.entries()]);
    });
  });
};