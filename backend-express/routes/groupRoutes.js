import express from "express";
import StudyGroup from "../models/StudyGroup.js";
import {requireAuth} from "../middleware/requireAuth.js";

const router = express.Router();

// create group
const { name, description, subject } = req.body

const group = await StudyGroup.create({
  name,
  description,
  subject,
  createdBy: req.user._id,
  members: [req.user._id], // ✅ ALWAYS ARRAY
})

// get groups of user
router.get("/", requireAuth, async (req, res) => {
  const groups = await StudyGroup.find({
    members: req.user.userId
  });

  res.json(groups);
});

export default router;