import Post from "../models/postModel.js";
import cloudinary from "../utils/cloudinary.js";

// 🔥 upload helper (returns full object)
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "posts",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else {
          resolve({
            url: result.secure_url,
            type: result.resource_type, // 🔥 image OR video
            public_id: result.public_id, // 🔥 for delete
          });
        }
      }
    );
    stream.end(buffer);
  });
};

// =========================
// CREATE POST
// =========================
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    let media = [];

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      media.push(uploaded);
    }

    if (!content && media.length === 0) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      media, // 🔥 changed from images
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("❌ CREATE POST ERROR:", err);
    next(err);
  }
};

// =========================
// GET POSTS
// =========================
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

// =========================
// DELETE POST
// =========================
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ FIXED AUTH
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 delete media from cloudinary
    if (post.media && post.media.length > 0) {
      for (const item of post.media) {
        await cloudinary.uploader.destroy(item.public_id, {
          resource_type: item.type === "video" ? "video" : "image",
        });
      }
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("❌ DELETE POST ERROR:", err);
    next(err);
  }
};