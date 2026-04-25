import Post from "../models/postModel.js";

// CREATE POST
export const createPost = async (req, res, next) => {
  try {
    const { content, images, image } = req.body;

    const finalImages = images || (image ? [image] : []);

    if (!content && finalImages.length === 0) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Post.create({
      author: req.user.userId, // ✅ FIXED
      content,
      images: finalImages,     // ✅ FIXED
    });

    res.status(201).json(post);
  } catch (err) {
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