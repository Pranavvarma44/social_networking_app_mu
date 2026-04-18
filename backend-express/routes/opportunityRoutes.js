import express from "express";
import Opportunity from "../models/Opportunity.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        location,
        company,
        type,
        category,
        skills,
        sort = "newest",
      } = req.query;
  
      const query = {};
  
     
      if (search) {
        query.title = { $regex: search, $options: "i" };
      }
  
      
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
  
      
      if (company) {
        query.company = { $regex: company, $options: "i" };
      }
  
      // 💼 Type filter
      if (type) {
        query.type = type;
      }
  
      // 🏷 Category filter
      if (category) {
        query.category = category;
      }
  
      // 🧠 Skills filter (array field)
      if (skills) {
        query.skills = { $in: skills.split(",") };
      }
  
      const sortOption =
        sort === "oldest"
          ? { createdAt: 1 }
          : { createdAt: -1 };
  
      const opportunities = await Opportunity.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const total = await Opportunity.countDocuments(query);
  
      res.json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        opportunities,
      });
    } catch (error) {
      console.log("Fetch opportunities error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post("/", requireAuth, async (req, res) => {
  try {
    if (!["alumni", "admin","faculty"].includes(req.user.role)) {
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