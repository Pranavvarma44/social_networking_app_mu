import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.user._id;
  
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }
        },
  
        // Sort by latest first
        { $sort: { createdAt: -1 } },
  
        // Group by conversation partner
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            },
            lastMessage: { $first: "$$ROOT" }
          }
        },
  
        // Populate user details
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
  
        { $unwind: "$user" },
  
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            email: "$user.email",
            lastMessage: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt"
          }
        }
      ]);
  
      res.json({ conversations });
  
    } catch (err) {
      console.error("Conversation error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

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