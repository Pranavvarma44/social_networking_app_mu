import Post from "../models/postModel.js";
import Post from "../models/postModel.js";

import cloudinary from "../utils/cloudinary.js";

// helper to upload buffer

const uploadToCloudinary = (buffer) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      { folder: "posts" },

      (error, result) => {

        if (error) reject(error);

        else resolve(result.secure_url);

      }

    );

    stream.end(buffer);

  });

};

// CREATE POST
export const createPost = async (req, res, next) => {

  try {

    const { content } = req.body;

    let imageUrl = null;

    // 🔥 if file exists → upload

    if (req.file) {

      imageUrl = await uploadToCloudinary(req.file.buffer);

    }

    if (!content && !imageUrl) {

      return res.status(400).json({ message: "Post cannot be empty" });

    }

    const post = await Post.create({

      author: req.user._id,

      content,

      images: imageUrl ? [imageUrl] : [],

    });

    res.status(201).json(post);

  } catch (err) {

    console.error("❌ CREATE POST ERROR:", err);

    next(err);

  }

};
// GET POSTS
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// DELETE POST
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.userId) { // ✅ FIXED
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};