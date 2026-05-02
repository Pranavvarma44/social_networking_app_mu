import express from "express";
import StudyGroup from "../models/StudyGroup.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();


// ================= CREATE =================
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, description, subject } = req.body;

    const group = await StudyGroup.create({
      name,
      description,
      subject,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: "Error creating group" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
    try {
      const group = await StudyGroup.findById(req.params.id)
        .populate("members", "name email")
        .populate("createdBy", "name")
  
      res.json(group)
    } catch (err) {
      res.status(500).json({ error: "Fetch group failed" })
    }
  })

  router.post("/:id/remove", requireAuth, async (req, res) => {
    try {
      const { userId } = req.body
  
      const group = await StudyGroup.findById(req.params.id)
  
      if (group.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not authorized" })
      }
  
      group.members = group.members.filter(
        (m) => m.toString() !== userId
      )
  
      await group.save()
  
      res.json(group)
    } catch {
      res.status(500).json({ error: "Remove failed" })
    }
  })

// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const groups = await StudyGroup.find()
      .populate("createdBy", "name")
      .populate("members", "name");

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Error fetching groups" });
  }
});


// ================= JOIN =================
router.post("/:id/join", requireAuth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    res.json(group);
  } catch {
    res.status(500).json({ error: "Join failed" });
  }
});


// ================= LEAVE =================
router.post("/:id/leave", requireAuth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    group.members = group.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );

    await group.save();

    res.json(group);
  } catch {
    res.status(500).json({ error: "Leave failed" });
  }
});

export default router;