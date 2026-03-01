import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({
    user: req.user,
  });
});

router.get("/:id", requireAuth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password -__v")
        .populate("followers", "name role")
        .populate("following", "name role");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ user });
  
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
router.get("/", async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search
      } = req.query;
  
      const query = {};
  
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
  
      const users = await User.find(query)
        .select("name email role")
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const total = await User.countDocuments(query);
  
      res.json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (error) {
      console.log("Users fetch error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post("/:id/follow", requireAuth, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);
  
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (targetUser._id.equals(currentUser._id)) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }
  
      if (!currentUser.following.includes(targetUser._id)) {
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
  
        await currentUser.save();
        await targetUser.save();
      }
  
      res.json({ message: "User followed successfully" });
  
    } catch (error) {
      console.error("Follow error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.delete("/:id/unfollow", requireAuth, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);
  
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
  
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
  
      await currentUser.save();
      await targetUser.save();
  
      res.json({ message: "User unfollowed successfully" });
  
    } catch (error) {
      console.error("Unfollow error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  export default router;

