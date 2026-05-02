import express from "express";
import GroupMessage from "../models/GroupMessage.js";
import StudyGroup from "../models/StudyGroup.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();


// ================= GET MESSAGES =================
router.get("/:groupId", requireAuth, async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({ group: groupId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= SEND MESSAGE =================
router.post("/:groupId", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const { groupId } = req.params;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    // ✅ OPTIONAL: Check if user is member
    const group = await StudyGroup.findById(groupId);

    if (!group.members.some(
      (m) => m.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({ error: "Not a group member" });
    }

    const message = await GroupMessage.create({
      group: groupId,
      sender: req.user._id,
      text,
    });

    const populated = await message.populate("sender", "name");

    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE MESSAGE (optional admin) =================
router.delete("/:messageId", requireAuth, async (req, res) => {
  try {
    const message = await GroupMessage.findById(req.params.messageId);

    if (!message) return res.status(404).json({ error: "Not found" });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await message.deleteOne();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;