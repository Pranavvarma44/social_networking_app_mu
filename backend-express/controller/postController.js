import postSchema from "../models/postModel";

export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;

    const post = await Post.create({
      author: req.user.id,
      content,
      image,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Get all posts (basic feed)
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

// Delete post
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};