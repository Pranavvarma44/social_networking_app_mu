import express from "express";
import Opportunity from "../models/Opportunity.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ opportunities });

  } catch (error) {
    console.error("Fetch opportunities error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    if (!["alumni", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        error: "Only alumni or admin can post opportunities"
      });
    }

    const { title, company, description, location, type } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        error: "Title, company and description required"
      });
    }

    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      location,
      type,
      postedBy: req.user._id,
    });

    res.status(201).json({
      message: "Opportunity created",
      opportunity,
    });

  } catch (error) {
    console.error("Create opportunity error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, company, description, location, type } = req.body;
  
      const opportunity = await Opportunity.findById(id);
  
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
  
     
      if (
        opportunity.postedBy.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Not authorized" });
      }
  
      opportunity.title = title || opportunity.title;
      opportunity.company = company || opportunity.company;
      opportunity.description = description || opportunity.description;
      opportunity.location = location || opportunity.location;
      opportunity.type = type || opportunity.type;
  
      await opportunity.save();
  
      res.json({
        message: "Opportunity updated",
        opportunity,
      });
  
    } catch (error) {
      console.error("Update opportunity error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.delete("/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
  
      const opportunity = await Opportunity.findById(id);
  
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
  
      if (
        opportunity.postedBy.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Not authorized" });
      }
  
      await opportunity.deleteOne();
  
      res.json({ message: "Opportunity deleted successfully" });
  
    } catch (error) {
      console.error("Delete opportunity error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  

export default router;