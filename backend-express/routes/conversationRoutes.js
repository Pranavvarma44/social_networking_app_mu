import express, { Route } from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import Conversation from "../models/Conversation.js";
const router = express.Router();

router.get("/",requireAuth,async(req,res)=>{
    try {

        const conversations = await Conversation.find({
    
          participants: req.user._id,
    
        })
    
          .populate("participants", "name email role")
    
          .sort({ updatedAt: -1 });
    
        res.json(conversations);
    
      } catch (err) {
    
        console.error("CONVO ERROR:", err);
    
        res.status(500).json({ error: "Failed to fetch conversations" });
    
      }
});

router.post("/start/:userId",requireAuth,async(req,res)=>{
    try {

        const { userId } = req.params;
    
        // check existing
    
        let convo = await Conversation.findOne({
    
          participants: { $all: [req.user._id, userId] },
    
        });
    
        if (!convo) {
    
          convo = await Conversation.create({
    
            participants: [req.user._id, userId],
    
          });
    
        }
    
        res.json(convo);
    
      } catch (err) {
    
        console.error("START CONVO ERROR:", err);
    
        res.status(500).json({ error: "Failed to start conversation" });
    
      }

})



export default router;