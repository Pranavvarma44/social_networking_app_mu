import express from "express";
import StudyGroup from "../models/StudyGroup.js";
import {requireAuth} from "../middleware/requireAuth.js";

const router = express.Router();

// create group
router.post("/", requireAuth, async (req, res) => {
  const { name, description, subject } = req.body

const group = await StudyGroup.create({
  name,
  description,
  subject,
  createdBy: req.user._id,
  members: [req.user._id], // ✅ ALWAYS ARRAY
});

  res.json(group);
});

// get groups of user
router.get("/", requireAuth, async (req, res) => {

  const groups = await StudyGroup.find()

  res.json(groups)

})

export default router;