import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import Message from "../models/Message.js";

const router = express.Router();

// Get conversation
router.get("/:userId", requireAuth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json({ messages });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;