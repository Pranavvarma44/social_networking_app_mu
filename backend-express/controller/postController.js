import Post from "../models/postModel.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// =========================
// 🔥 UPLOAD HELPER
// =========================
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
            type: result.resource_type, // image | video
            public_id: result.public_id,
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
      media,
      seenBy: [], // 🔥 optional (for feed filtering)
    });

    const populated = await post.populate("author", "name email");

    res.status(201).json(populated);

  } catch (err) {
    console.error("❌ CREATE POST ERROR:", err);
    next(err);
  }
};

// =========================
// GET ALL POSTS (ADMIN / DEBUG)
// =========================
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error("❌ GET POSTS ERROR:", err);
    next(err);
  }
};

// =========================
//  GET FEED POSTS
// =========================
export const getFeedPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // include following + self
    const authors = [...user.following];

    const posts = await Post.find({
      author: { $in: authors },

      // 🔥 optional: remove seen posts
      seenBy: { $ne: userId },
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error("❌ FEED ERROR:", err);
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

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 delete media from Cloudinary
    if (post.media?.length > 0) {
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

// =========================
// 🔥 MARK POST AS SEEN
// =========================
export const markPostSeen = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Post.findByIdAndUpdate(req.params.postId, {
      $addToSet: { seenBy: userId },
    });

    res.json({ message: "Post marked as seen" });

  } catch (err) {
    console.error("❌ SEEN ERROR:", err);
    next(err);
  }
};