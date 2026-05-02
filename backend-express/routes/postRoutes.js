import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";

import {
  createPost,
  getPosts,
  getFeedPosts,      // 🔥 NEW
  deletePost,
  markPostSeen ,
  getUserPosts   ,   // 🔥 NEW
} from "../controller/postController.js";

import {
  addComment,
  getComments,
  deleteComment,
} from "../controller/commentController.js";

import { toggleLike } from "../controller/likeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   POST ROUTES
========================= */

// 🔥 CREATE POST (image/video)
router.post("/", requireAuth, upload.single("media"), createPost);

// 🔥 FEED (following + own posts)
router.get("/feed", requireAuth, getFeedPosts);

// GET ALL POSTS (fallback/debug)
router.get("/", requireAuth, getPosts);
router.get("/user/:userId", requireAuth, getUserPosts)

// DELETE POST
router.delete("/:postId", requireAuth, deletePost);

// 🔥 MARK POST AS SEEN
router.post("/:postId/seen", requireAuth, markPostSeen);

/* =========================
   COMMENTS
========================= */

router.post("/:postId/comments", requireAuth, addComment);
router.get("/:postId/comments", requireAuth, getComments);
router.delete("/comments/:commentId", requireAuth, deleteComment);

/* =========================
   LIKE
========================= */

router.post("/:postId/like", requireAuth, toggleLike);

export default router;