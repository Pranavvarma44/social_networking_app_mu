import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  createPost,
  getPosts,
  deletePost,
} from "../controllers/post.controller.js";

import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

import { toggleLike } from "../controllers/like.controller.js";

const router = express.Router();

/* =========================
   POST ROUTES
========================= */

// Create post
router.post("/posts", requireAuth, createPost);

// Get all posts (feed)
router.get("/posts", requireAuth, getPosts);

// Delete post
router.delete("/posts/:postId", requireAuth, deletePost);


/* =========================
   COMMENT ROUTES
========================= */

// Add comment to a post
router.post("/posts/:postId/comments", requireAuth, addComment);

// Get comments of a post
router.get("/posts/:postId/comments", requireAuth, getComments);

// Delete a comment
router.delete("/comments/:commentId", requireAuth, deleteComment);


/* =========================
   LIKE ROUTES
========================= */

// Like / Unlike toggle
router.post("/posts/:postId/like", requireAuth, toggleLike);

export default router;