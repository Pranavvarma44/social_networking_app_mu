import express from "express";
import {requireAuth} from "../middleware/requireAuth.js";

import {
  createPost,
  getPosts,
  deletePost,
} from "../controller/postController.js";

import {
  addComment,
  getComments,
  deleteComment,
} from "../controller/commentController.js";

import { toggleLike } from "../controller/likeController.js";

const router = express.Router();

/* =========================
   POST ROUTES
========================= */

// Create post
router.post("/", requireAuth, createPost);

// GET POSTS

router.get("/", requireAuth, getPosts);

// DELETE POST

router.delete("/:postId", requireAuth, deletePost);

// COMMENTS

router.post("/:postId/comments", requireAuth, addComment);

router.get("/:postId/comments", requireAuth, getComments);

router.delete("/comments/:commentId", requireAuth, deleteComment);

// LIKE

router.post("/:postId/like", requireAuth, toggleLike);

export default router;